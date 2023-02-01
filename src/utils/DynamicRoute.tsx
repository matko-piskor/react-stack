import { type LazyExoticComponent, Suspense } from 'react';

export function Dynamic(Component: LazyExoticComponent<() => JSX.Element>) {
    return (
        <Suspense fallback={<div>Loading</div>}>
            <Component />
        </Suspense>
    );
}
