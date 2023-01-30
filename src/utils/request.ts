import { capitalize } from './string';

export function segmentPaths(path: string) {
    const url = new URL(path);

    const paths = url.pathname.split('/').filter(Boolean);

    return paths;
}

export function createRelativeBreadcrumbs(paths: string[]) {
    const breadcrumbs = paths.map((segment, index, src) => {
        const path = src.slice(0, index + 1).join('/');
        const title = capitalize(segment);

        return {
            path,
            title,
        };
    });

    breadcrumbs.unshift({ path: '/', title: 'Home' });

    return breadcrumbs;
}

export function getPathFromRequest(req: Request) {
    const url = new URL(req.url);

    return url.pathname;
}
