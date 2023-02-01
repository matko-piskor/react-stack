import { lazy } from 'react';
import { ConfigProvider } from 'antd';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { layoutLoader } from './routes/_layout';
import { Dynamic } from './utils/DynamicRoute';

import { env } from './env/schema';

const router = createBrowserRouter([
    {
        path: '/',
        element: Dynamic(lazy(() => import('./routes/_root'))),
        errorElement: Dynamic(lazy(() => import('./routes/not-found'))),
        children: [
            {
                path: '',
                element: Dynamic(lazy(() => import('./routes/_layout'))),
                loader: layoutLoader,
                shouldRevalidate: () => true,
                children: [
                    { path: '', element: Dynamic(lazy(() => import('./routes/home'))), index: true },
                    {
                        path: 'table-with-filters',
                        element: Dynamic(lazy(() => import('./routes/table-with-filters'))),
                    },
                ],
            },
            {
                path: 'login',
                element: Dynamic(lazy(() => import('./routes/login'))),
            },
        ],
    },
]);

const colorPrimary = `#${env.VITE_COLOR_PRIMARY}`;

export default function App() {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary,
                    controlItemBgActive: 'whitesmoke',
                },
            }}
        >
            <RouterProvider router={router} />
        </ConfigProvider>
    );
}
