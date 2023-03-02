import { useRouteLoaderData } from 'react-router-dom';

export type Maybe<T> = T | null | undefined;

export function useTypedRouteLoaderData<T>(key: string): Maybe<T> {
    const data = useRouteLoaderData(key) as T;
    return data;
}
