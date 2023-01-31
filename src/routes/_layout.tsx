import { FileSearchOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Dropdown, Layout, Menu, type MenuProps, type SiderProps } from 'antd';
import { useCallback, useMemo, useRef, useState } from 'react';
import { json, Link, Outlet, useLoaderData, useNavigate, type LoaderFunctionArgs } from 'react-router-dom';
import { createRelativeBreadcrumbs, getPathFromRequest, segmentPaths } from '~/utils/request';
import { stripLeadingSlash } from '~/utils/string';

const { Header, Content, Sider } = Layout;

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
    const { Settings } = useSettings();
    return (
        <Layout className='!relative !min-h-screen'>
            <Header
                className='!sticky !top-0 !z-50 !h-16 !bg-slate-500 !px-4'
                style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}
            >
                <nav className='flex h-full items-center justify-between gap-2'>
                    <SidemenuTrigger />
                    <Settings />
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

    const ref = useRef(null);

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
                className='!fixed !top-16 !bottom-0  !h-screen !overflow-auto'
                ref={ref}
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
                className='text-accent flex items-center justify-center'
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

function useSettings() {
    const navigate = useNavigate();

    const items = useMemo<Array<MenuItemProps>>(
        () => [
            {
                key: `login`,
                label: `Login`,
                onClick: () => void navigate('/login'),
                tabIndex: '0',
            },
        ],
        [navigate],
    );

    const Settings = useCallback(() => {
        return (
            <Dropdown menu={{ items }} trigger={['click']}>
                <Button
                    type='ghost'
                    size='large'
                    icon={<SettingOutlined />}
                    className='text-accent flex items-center justify-center'
                />
            </Dropdown>
        );
    }, [items]);

    return {
        Settings,
    };
}
