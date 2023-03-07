import { type TableProps } from 'antd';
import { z, type ZodObject } from 'zod';

export function typedBoolean<T>(value: T): value is Exclude<T, false | null | undefined | '' | 0> {
    return Boolean(value);
}

export function schemaToColumns<T>(schema: ZodObject<z.ZodRawShape>): TableProps<T>['columns'] {
    return Object.entries(schema.shape).map(([key, value]) => ({
        title: key,
        dataIndex: key,
        key,
        render: (text: unknown) => {
            if (value instanceof z.ZodBoolean) {
                return text ? 'Yes' : 'No';
            }
            if (value instanceof z.ZodOptional && !text) {
                return 'N/A';
            }
            if (value instanceof z.ZodDate && (text instanceof Date || typeof text === 'string')) {
                return new Date(text).toLocaleDateString();
            }
            if (value instanceof z.ZodString) {
                return text;
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (text as any).toString();
        },
    }));
}
