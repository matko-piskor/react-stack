import { z } from 'zod';
import { test } from 'vitest';
import { processSearchParams } from '~/utils/process-search-params';

// test processSearchParams
test('process search params with string required params', async () => {
    const request = new Request('https://example.com/?foo=bar&baz=qux');
    const schema = z.object({
        foo: z.string(),
        baz: z.string(),
    });

    const searchParams = processSearchParams({
        request,
        schema,
    });

    expect(searchParams).toEqual({
        foo: 'bar',
        baz: 'qux',
    });
});

test('process search params with string optional params', async () => {
    const request = new Request('https://example.com/?foo=bar&baz=qux');
    const schema = z.object({
        foo: z.string(),
        baz: z.string(),
        qux: z.string().optional(),
    });

    const searchParams = processSearchParams({
        request,
        schema,
    });

    expect(searchParams).toEqual({
        foo: 'bar',
        baz: 'qux',
        qux: undefined,
    });
});

test('process search params with string optional params with default', async () => {
    const request = new Request('https://example.com/?foo=bar&baz=qux');
    const schema = z.object({
        foo: z.string(),
        baz: z.string(),
        qux: z.string().optional().default('quux'),
    });

    const searchParams = processSearchParams({
        request,
        schema,
    });

    expect(searchParams).toEqual({
        foo: 'bar',
        baz: 'qux',
        qux: 'quux',
    });
});

test.fails('process search params with string optional params with default and value and extra params', async () => {
    const request = new Request('https://example.com/?foo=bar&baz=qux&qux=quux&corge=grault');
    const schema = z.object({
        foo: z.string(),
        baz: z.string(),
        qux: z.string().optional().default('quux'),
    });
    function testFn() {
        processSearchParams({
            request,
            schema,
        });
    }

    expect(testFn()).toThrowError(' Unexpected search parameters: corge');
});

test("process search params with params of types 'number, array, enum'", () => {
    const request = new Request('https://example.com/?foo=bar&baz=1&qux=quu&qux=quu2&corge=grault');
    const schema = z.object({
        foo: z.string(),
        baz: z.number(),
        qux: z.array(z.string()),
        corge: z.enum(['grault', 'garply']),
    });

    const searchParams = processSearchParams({
        request,
        schema,
    });

    expect(searchParams).toEqual({
        foo: 'bar',
        baz: 1,
        qux: ['quu', 'quu2'],
        corge: 'grault',
    });
});
