import { type TableProps } from 'antd';
import { useRouteLoaderData } from 'react-router-dom';
import { z, type ZodObject } from 'zod';
import { type User } from '~/models/user';

export const DEFAULT_REDIRECT = '/';

export function safeRedirect(
    to: FormDataEntryValue | string | null | undefined,
    defaultRedirect: string = DEFAULT_REDIRECT,
) {
    if (!to || typeof to !== 'string') {
        return defaultRedirect;
    }

    if (!to.startsWith('/') || to.startsWith('//')) {
        return defaultRedirect;
    }

    return to;
}

export type Maybe<T> = T | null | undefined;

export function isUser(user: Maybe<User>): user is User {
    return !!user && typeof user === 'object' && typeof user.id === 'string';
}

export function useOptionalUser(): User | undefined {
    const data = useRouteLoaderData('root') as { user: Maybe<User> };
    if (!data || !isUser(data.user)) {
        return undefined;
    }
    return data.user;
}

export function useUser(): User {
    const maybeUser = useOptionalUser();
    if (!maybeUser) {
        throw new Error(
            'No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.',
        );
    }
    return maybeUser;
}

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
