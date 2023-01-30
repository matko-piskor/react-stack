import { FileSearchOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Dropdown, Layout, Menu, type MenuProps, type SiderProps } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { json, Link, Outlet, useLoaderData, useNavigate, type LoaderFunctionArgs } from 'react-router-dom';
import { createRelativeBreadcrumbs, getPathFromRequest, segmentPaths } from '~/utils/request';
import { stripLeadingSlash } from '~/utils/string';

const { Header, Content, Sider } = Layout;

const settingsItems: MenuProps['items'] = [
    {
        key: `login`,
        label: `Login`,
    },
];

type LayoutLoaderData = {
    breadcrumbs: ReturnType<typeof createRelativeBreadcrumbs>;
    path: ReturnType<typeof getPathFromRequest>;
};

export function layoutLoader(params: LoaderFunctionArgs) {
    const breadcrumbs = createRelativeBreadcrumbs(segmentPaths(params.request.url));
    const path = getPathFromRequest(params.request);
    return json({ breadcrumbs, path });
}

export default function RootRoute() {
    const { breadcrumbs, path } = useLoaderData() as LayoutLoaderData;
    const { SiderMenu, SidemenuTrigger, contentMargin } = useSiderMenu({ path });

    return (
        <Layout className='!min-h-screen !relative'>
            <Header
                className='!bg-slate-500 !sticky !top-0 !z-50 !h-16 !px-4'
                style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}
            >
                <nav className='flex gap-2 h-full justify-between items-center'>
                    <SidemenuTrigger />
                    <Dropdown menu={{ items: settingsItems }} trigger={['click']}>
                        <Button
                            type='ghost'
                            size='large'
                            icon={<SettingOutlined />}
                            className='flex justify-center items-center text-accent'
                        />
                    </Dropdown>
                </nav>
            </Header>
            <Layout>
                <SiderMenu />
                <Layout className='px-8 py-4' style={{ marginLeft: contentMargin }}>
                    <Breadcrumb>
                        {breadcrumbs.map((breadcrumb, index) => (
                            <Breadcrumb.Item key={index}>
                                <Link to={breadcrumb.path}>{breadcrumb.title}</Link>
                            </Breadcrumb.Item>
                        ))}
                    </Breadcrumb>
                    <Content className='h-[2000px]'>
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

type MenuItemProps = NonNullable<MenuProps['items']>[number] & { tabIndex?: string };

function useSiderMenu({ path }: Pick<LayoutLoaderData, 'path'>) {
    const navigate = useNavigate();

    const [collapsed, setCollapsed] = useState(false);
    const [broken, setBroken] = useState(false);

    const collapsedWidth = broken ? 0 : 80;
    const width = 200;
    const contentMargin = collapsed ? collapsedWidth : width;

    const selectedKeys = useMemo(() => {
        const candidate = stripLeadingSlash(path);
        return candidate === '' ? undefined : [candidate];
    }, [path]);

    const toggle = useCallback(() => {
        setCollapsed((prev) => !prev);
    }, []);

    const onBreakpoint = useCallback(
        (b: Parameters<NonNullable<SiderProps['onBreakpoint']>>[0]) => {
            if (b !== broken) {
                setBroken(b);
                setCollapsed(b);
            }
        },
        [broken],
    );

    const items = useMemo<Array<MenuItemProps>>(
        () => [
            {
                key: `table-with-filters`,
                icon: <FileSearchOutlined />,
                label: `Table with filters`,
                tabIndex: '0',
                onClick: () => void navigate('/table-with-filters'),
            },
        ],
        [navigate],
    );

    const SiderMenu = useCallback(() => {
        return (
            <Sider
                width={width}
                trigger={null}
                collapsible
                collapsed={collapsed}
                breakpoint='lg'
                collapsedWidth={collapsedWidth}
                onBreakpoint={onBreakpoint}
                className='!overflow-auto !h-screen !fixed  !top-16 !bottom-0'
            >
                <Menu
                    mode='inline'
                    defaultSelectedKeys={selectedKeys}
                    style={{
                        height: '100%',
                        borderRight: 0,
                    }}
                    items={items}
                />
            </Sider>
        );
    }, [collapsed, collapsedWidth, onBreakpoint, selectedKeys, items]);

    const SidemenuTrigger = useCallback(() => {
        return (
            <Button
                type='ghost'
                size='large'
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                className='flex justify-center items-center text-accent'
                onClick={toggle}
            />
        );
    }, [collapsed, toggle]);

    return {
        contentMargin,
        SiderMenu,
        SidemenuTrigger,
    };
}
