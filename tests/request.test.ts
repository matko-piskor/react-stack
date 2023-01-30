import { createRelativeBreadcrumbs, getPathFromRequest, segmentPaths } from '../src/utils/request';

test('Segments should be extracted from url', () => {
    const path = 'https://example.com/foo/bar/baz';
    const segments = segmentPaths(path);
    expect(segments).toEqual(['foo', 'bar', 'baz']);
});

test('Segments should be extracted from url with trailing slash', () => {
    const path = 'https://example.com/foo/bar/baz/';
    const segments = segmentPaths(path);
    expect(segments).toEqual(['foo', 'bar', 'baz']);
});

test('Segments should be extracted from url with query string', () => {
    const path = 'https://example.com/foo/bar/baz/?query=string';
    const segments = segmentPaths(path);
    expect(segments).toEqual(['foo', 'bar', 'baz']);
});

test('Segments should be extracted from url with hash', () => {
    const path = 'https://example.com/foo/bar/baz/#hash';
    const segments = segmentPaths(path);
    expect(segments).toEqual(['foo', 'bar', 'baz']);
});

test('Segments should be extracted from url with query string and hash', () => {
    const path = 'https://example.com/foo/bar/baz/?query=string#hash';
    const segments = segmentPaths(path);
    expect(segments).toEqual(['foo', 'bar', 'baz']);
});

test('Segments should be extracted from url with query string and hash and trailing slash', () => {
    const path = 'https://example.com/foo/bar/baz/?query=string#hash/';
    const segments = segmentPaths(path);
    expect(segments).toEqual(['foo', 'bar', 'baz']);
});

test('Segments should be extracted from url with query string and hash and trailing slash and multiple slashes', () => {
    const path = 'https://example.com/foo/bar/baz/?query=string#hash//';
    const segments = segmentPaths(path);
    expect(segments).toEqual(['foo', 'bar', 'baz']);
});

test('Relatve breadsrubms should be created from segments', () => {
    const paths = ['foo', 'bar', 'baz'];
    const breadcrumbs = createRelativeBreadcrumbs(paths);
    expect(breadcrumbs).toEqual([
        { path: '/', title: 'Home' },
        { path: 'foo', title: 'Foo' },
        { path: 'foo/bar', title: 'Bar' },
        { path: 'foo/bar/baz', title: 'Baz' },
    ]);
});

test('Relative breadcrubms should be created from segments with trailing slash', () => {
    const paths = ['foo', 'bar', 'baz'];
    const breadcrumbs = createRelativeBreadcrumbs(paths);
    expect(breadcrumbs).toEqual([
        { path: '/', title: 'Home' },
        { path: 'foo', title: 'Foo' },
        { path: 'foo/bar', title: 'Bar' },
        { path: 'foo/bar/baz', title: 'Baz' },
    ]);
});

describe('getPathFromRequest', () => {
    test('should return path', () => {
        const req: Request = {
            url: 'https://localhost:3000/posts/1',
        } as unknown as Request;

        expect(getPathFromRequest(req)).toBe('/posts/1');
    });
});
