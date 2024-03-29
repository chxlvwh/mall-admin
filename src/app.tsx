// import Footer from '@/components/Footer';
import { Question, SelectLang } from '@/components/RightContent';
import { currentUser as queryCurrentUser } from '@/services/mall-service/api';
import { LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { PageLoading, SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import { ConfigProvider } from 'antd';
import defaultSettings from '../config/defaultSettings';
import { AvatarDropdown, AvatarName } from './components/RightContent/AvatarDropdown';
import { errorConfig } from './requestErrorConfig';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
    settings?: Partial<LayoutSettings>;
    currentUser?: API.CurrentUser;
    loading?: boolean;
    fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
    const fetchUserInfo = async () => {
        try {
            const msg = await queryCurrentUser({
                // skipErrorHandler: true,
            });
            return msg.data;
        } catch (error) {
            console.log('[app.tsx:] ', error);
        }
        return undefined;
    };
    // 如果不是登录页面，执行
    const { location } = history;
    if (location.pathname !== loginPath) {
        const currentUser = await fetchUserInfo();
        console.log('[app.tsx:] ', currentUser);
        return {
            fetchUserInfo,
            currentUser,
            settings: defaultSettings as Partial<LayoutSettings>,
        };
    }
    return {
        fetchUserInfo,
        settings: defaultSettings as Partial<LayoutSettings>,
    };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
    return {
        siderWidth: 200,
        actionsRender: () => [<Question key="doc" />, <SelectLang key="SelectLang" />],
        avatarProps: {
            src: initialState?.currentUser?.profile?.avatar || '/icons/default-avatar.jpg',
            title: <AvatarName />,
            render: (_: any, avatarChildren: any) => {
                return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
            },
        },
        waterMarkProps: {
            content: initialState?.currentUser?.profile?.nickname,
        },
        // footerRender: () => <Footer />,
        onPageChange: () => {
            const { location } = history;
            // 如果没有登录，重定向到 login
            if (!initialState?.currentUser && location.pathname !== loginPath) {
                history.push(loginPath);
            }
        },
        layoutBgImgList: [
            {
                src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
                left: 85,
                bottom: 100,
                height: '303px',
            },
            {
                src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
                bottom: -68,
                right: -45,
                height: '303px',
            },
            {
                src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
                bottom: 0,
                left: 0,
                width: '331px',
            },
        ],
        links: isDev
            ? [
                  <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
                      <LinkOutlined />
                      <span>OpenAPI 文档</span>
                  </Link>,
              ]
            : [],
        menuHeaderRender: undefined,
        // 自定义 403 页面
        // unAccessible: <div>unAccessible</div>,
        // 增加一个 loading 的状态
        childrenRender: (children) => {
            if (initialState?.loading) return <PageLoading />;
            return (
                <>
                    <ConfigProvider
                        theme={{
                            token: {
                                borderRadius: 1,
                                colorFillAlter: '#f2f6fc',
                                colorBorderSecondary: '#dcdfe6',
                                colorTextDisabled: 'rgba(0,0,0,0.6)',
                            },
                        }}
                    >
                        {children}
                    </ConfigProvider>
                    <SettingDrawer
                        disableUrlParams
                        enableDarkTheme
                        settings={initialState?.settings}
                        onSettingChange={(settings) => {
                            setInitialState((preInitialState) => ({
                                ...preInitialState,
                                settings,
                            }));
                        }}
                    />
                </>
            );
        },
        ...initialState?.settings,
        token: {
            header: {
                colorBgHeader: '#292f33',
                colorHeaderTitle: '#fff',
                colorTextMenu: '#dfdfdf',
                colorTextMenuSecondary: '#dfdfdf',
                colorTextMenuSelected: '#fff',
                colorBgMenuItemSelected: '#22272b',
                colorTextMenuActive: 'rgba(255,255,255,0.85)',
                colorTextRightActionsItem: '#dfdfdf',
                heightLayoutHeader: '48px',
            },
            colorTextAppListIconHover: '#fff',
            colorTextAppListIcon: '#dfdfdf',
            sider: {
                // colorMenuBackground: 'rgba(0,0,0,0)',
                colorMenuBackground: '#fff',
                colorMenuItemDivider: '#dfdfdf',
                colorTextMenu: '#595959',
                colorTextMenuSelected: 'rgba(42,122,251,1)',
                colorBgMenuItemSelected: 'rgba(230,243,254,1)',
            },
        },
    };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
    ...errorConfig,
};
