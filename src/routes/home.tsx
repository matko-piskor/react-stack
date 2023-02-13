import { json, useLoaderData, useRouteError, type LoaderFunctionArgs } from 'react-router-dom';
import { ensureNoEmptySearchParams, processSearchParams } from '~/utils/process-search-params';
import { z } from 'zod';

const schema = z.object({
    p: z
        .string()
        .transform((val) => {
            const parsed = parseInt(val, 10);
            if (isNaN(parsed)) {
                throw new Response('p must be a number', { status: 400 });
            }
            return parsed;
        })
        .optional(),
    sd: z.enum(['asc', 'desc']).optional(),
    sf: z.string().optional(),
    arr: z.array(z.string()).optional(),
});

const transformedSchema = schema.transform((input) => ({
    page: input.p,
    sortDirection: input.sd,
    sortField: input.sf,
    arr: input.arr,
}));

type LoaderReturnType = {
    searchParams: z.infer<typeof transformedSchema>;
};

export async function homeLoader(args: LoaderFunctionArgs) {
    ensureNoEmptySearchParams(args.request);
    const params = processSearchParams({ request: args.request, schema, transformedSchema });

    return json({ searchParams: params }, { status: 200 });
}

export default function HomeRoute() {
    const loaderData = useLoaderData() as LoaderReturnType;

    return (
        <div className='m-auto p-8'>
            <h1 className='block text-lg text-red-700'>Home</h1>
            <div>
                <code>
                    <pre>{JSON.stringify(loaderData.searchParams, null, 2)}</pre>
                </code>
            </div>
        </div>
    );
}

export function HomeErrorBoundary() {
    const error = useRouteError();
    return (
        <div>
            <h2>Dang!</h2>
            <h3>Here is an error</h3>
            <code>
                <pre>{JSON.stringify(error, null, 2)}</pre>
            </code>
        </div>
    );
}
