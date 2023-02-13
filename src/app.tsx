import { ConfigProvider } from 'antd';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { layoutLoader } from './routes/_layout';

import { env } from './env/schema';
import Home, { HomeErrorBoundary, homeLoader } from './routes/home';
import Root from './routes/_root';
import NotFound from './routes/not-found';
import Layout from './routes/_layout';
import TableWithFilters from './routes/table-with-filters';
import Login from './routes/login';

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
                        loader: homeLoader,
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
