import { useRouteError } from 'react-router-dom';

export default function HomeRoute() {
    return (
        <div className='m-auto p-8'>
            <div>
                <h1 className='block text-lg text-red-700'>Home</h1>
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
