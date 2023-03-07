import { ConfigProvider } from 'antd';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { layoutLoader } from './routes/_layout';

import { env } from './env/schema';
import Home, { HomeErrorBoundary } from './routes/home';
import Login from './routes/login';
import NotFound from './routes/not-found';
import TableWithFilters from './routes/table-with-filters';
import Layout from './routes/_layout';
import Root from './routes/_root';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <NotFound />,
        children: [
            {
                path: '',
                element: <Layout />,
                loader: layoutLoader,
                shouldRevalidate: () => true,
                children: [
                    {
                        path: '',
                        element: <Home />,
                        index: true,
                        errorElement: <HomeErrorBoundary />,
                    },
                    {
                        path: 'table-with-filters',
                        element: <TableWithFilters />,
                    },
                ],
            },
            {
                path: 'login',
                element: <Login />,
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
