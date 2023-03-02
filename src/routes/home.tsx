import {
    type ActionFunctionArgs,
    Form,
    json,
    useLoaderData,
    useRouteError,
    type LoaderFunctionArgs,
    redirect,
} from 'react-router-dom';
import { ensureNoEmptyFormData, ensureNoEmptySearchParams, processSearchParams } from '~/utils/process-search-params';
import { z } from 'zod';
import { createContext, useContext, useMemo } from 'react';

const schema = z.object({
    p: z.number().nonnegative().optional(),
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

const reverseTransformedSchema = z
    .object({
        page: z.string().optional(),
        sortDirection: z.enum(['asc', 'desc']).optional(),
        sortField: z.string().optional(),
        arr: z.array(z.string()).optional(),
    })
    .transform((input) => ({
        p: input.page,
        sd: input.sortDirection,
        sf: input.sortField,
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

const Context = createContext<LoaderReturnType>({} as LoaderReturnType);

export default function HomeRoute() {
    const data = useLoaderData() as LoaderReturnType;

    const value = useMemo(() => data, [data]);
    return (
        <Context.Provider value={value}>
            <Home />
        </Context.Provider>
    );
}

export function useHomeContext() {
    return useContext(Context);
}

export async function homeAction(args: ActionFunctionArgs) {
    const noEmptyFormData = await ensureNoEmptyFormData(args.request);
    const data = Object.fromEntries(noEmptyFormData);
    const realData = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== '') {
            acc[key] = value;
        }
        return acc;
    }, {} as Record<string, unknown>);

    const params = reverseTransformedSchema.parse(realData);

    const url = new URL(args.request.url);

    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        if (Array.isArray(value)) {
            for (const item of value) {
                searchParams.append(key, item);
            }
        } else if (value !== undefined) {
            console.log(key, value);
            searchParams.set(key, value?.toString());
        }
    }

    url.search = searchParams.toString();

    return redirect(url.toString());
}

function Home() {
    const { searchParams } = useHomeContext();
    return (
        <div className='m-auto p-8'>
            <div>
                <h1 className='block text-lg text-red-700'>Home</h1>
            </div>
            <div>
                <Form method='post'>
                    <div className='flex gap-2'>
                        <div className='flex flex-col gap-2'>
                            <label>Page</label>
                            <input name='page' type='number' min={0} step={1} defaultValue={searchParams.page} />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label>Sort Direction</label>
                            <select name='sortDirection' defaultValue={searchParams.sortDirection}>
                                <option value='asc'>Ascending</option>
                                <option value='desc'>Descending</option>
                            </select>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label>Sort Field</label>
                            <input name='sortField' type='text' defaultValue={searchParams.sortField} />
                        </div>
                    </div>
                    <div>
                        <button type='submit'>Submit</button>
                    </div>
                </Form>
            </div>
            <code>
                <pre>{JSON.stringify(searchParams, null, 2)}</pre>
            </code>
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
