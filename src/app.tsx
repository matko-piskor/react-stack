import { ConfigProvider } from 'antd';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './routes/home';
import Layout, { layoutLoader } from './routes/_layout';
import TableWithFilters from './routes/table-with-filters';
import Root from './routes/_root';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: '/',
                element: <Layout />,
                loader: layoutLoader,
                shouldRevalidate: () => true,
                children: [
                    { path: '', element: <Home />, index: true },
                    {
                        path: 'table-with-filters',
                        element: <TableWithFilters />,
                    },
                ],
            },
        ],
    },
]);

const colorPrimary = import.meta.env?.VITE_COLOR_PRIMARY ? '#' + import.meta.env?.VITE_COLOR_PRIMARY : 'black';

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
