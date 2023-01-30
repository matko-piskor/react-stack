import { useRouteLoaderData } from 'react-router-dom';
import { type User } from '~/models/user';

export const DEFAULT_REDIRECT = '/';

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function _isUser(user: any): user is User {
    return !!user && typeof user === 'object' && typeof user.id === 'string';
}

export function useOptionalUser(): User | undefined {
    const data = useRouteLoaderData('root') as { user: User };
    if (!data || !_isUser(data.user)) {
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
