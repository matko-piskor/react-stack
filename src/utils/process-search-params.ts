import { redirect } from 'react-router-dom';
import { z } from 'zod';

export function processSearchParams<Schema extends z.ZodTypeAny, TransformedSchema extends z.ZodTypeAny>({
    request,
    schema,
    transformedSchema,
}: {
    request: Request;
    schema: Schema;
    transformedSchema?: TransformedSchema;
}): Schema {
    const data = preprocessSearchParams({ request, schema });

    if (transformedSchema) {
        return transformedSchema.parse(data);
    }
    const searchParameters = schema.parse(data);
    return searchParameters;
}

function preprocessSearchParams<Schema extends z.ZodTypeAny>({
    request,
    schema,
}: {
    request: Request;
    schema: Schema;
}) {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const shape = getShape(schema);

    return mapObj(
        shape,
        ([name, propertySchema]) =>
            transformDataValueBasedOnSchema(
                getValueBasedOnSchema(searchParams, String(name), propertySchema),
                propertySchema,
            ),
        Object.fromEntries(searchParams.entries()),
    );
}

export function ensureNoEmptySearchParams(request: Request) {
    const { searchParams, pathname } = new URL(request.url);
    const newSearchParams = new URLSearchParams(searchParams);
    let hasEmptyParam = false;
    for (const [key, value] of searchParams) {
        if (value === '') {
            newSearchParams.delete(key);
            hasEmptyParam = true;
        }
    }
    if (hasEmptyParam) {
        throw redirect(`${pathname}?${newSearchParams.toString()}`);
    }
}

function getShape<Schema extends z.ZodTypeAny>(schema: Schema) {
    let shape = schema;
    while (shape instanceof z.ZodObject || shape instanceof z.ZodEffects) {
        shape = shape instanceof z.ZodObject ? shape.shape : shape instanceof z.ZodEffects ? shape._def.schema : null;
        if (shape === null) {
            throw new Error(`Could not find shape`);
        }
    }
    return shape;
}

function mapObj<Key extends string, Value, MappedValue>(
    obj: Record<Key, Value>,
    cb: (entry: [Key, Value]) => MappedValue,
    source: Record<string, unknown>,
): Record<Key, MappedValue> {
    const src = { ...source };

    const data = Object.entries(obj).reduce((acc, entry) => {
        const key = entry[0] as Key;
        acc[key] = cb(entry as [Key, Value]);

        delete src[key];
        return acc;
    }, {} as Record<Key, MappedValue>);

    if (Object.keys(src).length > 0) {
        throw new Response(`Unexpected search parameters: ${Object.keys(src).join(', ')}`, { status: 400 });
    }
    return data;
}

function transformDataValueBasedOnSchema(value: unknown, propertySchema: z.ZodTypeAny): unknown {
    if (propertySchema instanceof z.ZodEffects) {
        return transformDataValueBasedOnSchema(value, propertySchema.innerType());
    }
    if (propertySchema instanceof z.ZodOptional) {
        return transformDataValueBasedOnSchema(value, propertySchema.unwrap());
    }
    if (propertySchema instanceof z.ZodDefault) {
        return transformDataValueBasedOnSchema(value, propertySchema.removeDefault());
    }
    if (propertySchema instanceof z.ZodArray) {
        if (!value || !Array.isArray(value)) {
            throw new Error('Expected array');
        }
        if (value.length === 0) {
            return undefined;
        }
        return value.map((v) => transformDataValueBasedOnSchema(v, propertySchema.element));
    }
    if (propertySchema instanceof z.ZodObject) {
        throw new Error('Support object types');
    }
    if (propertySchema instanceof z.ZodBoolean) {
        return Boolean(value);
    }
    if (propertySchema instanceof z.ZodNumber) {
        if (value === null || value === '') {
            return undefined;
        } else {
            return Number(value);
        }
    }
    if (propertySchema instanceof z.ZodString) {
        if (value === null) {
            return undefined;
        } else {
            return String(value);
        }
    }
    if (propertySchema instanceof z.ZodEnum) {
        if (value === null) {
            return undefined;
        } else {
            return value as string;
        }
    }

    return value;
}

function getValueBasedOnSchema<
    Value,
    Data extends {
        get: (key: string) => Value | null;
        getAll: (key: string) => Array<Value>;
    },
>(formData: Data, name: string, schema: z.ZodTypeAny): Value | Array<Value> | null | undefined {
    if (schema instanceof z.ZodEffects) {
        return getValueBasedOnSchema(formData, name, schema.innerType());
    }
    if (schema instanceof z.ZodOptional) {
        return getValueBasedOnSchema(formData, name, schema.unwrap());
    }
    if (schema instanceof z.ZodDefault) {
        return getValueBasedOnSchema(formData, name, schema.removeDefault());
    }
    if (schema instanceof z.ZodArray) {
        return formData.getAll(name);
    }
    return formData.get(name);
}
