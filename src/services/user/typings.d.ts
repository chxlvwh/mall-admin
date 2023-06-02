// @ts-ignore
/* eslint-disable */

declare namespace API {
    type CurrentUser = {
        id: number;
        username?: string;
        createdAt?: Date;
        lastModified?: Date;
        deletedAt?: Date;
        profile?: Profile;
        logs?: object[];
        roles?: object[];
    };

    type Profile = {
        id?: number;
        gender?: number;
        nickName?: string;
        email?: string;
        avatar?: string;
        address?: string;
    };

    type UserForm = CurrentUser & Profile;

    type LoginResult = {
        status?: string;
        type?: string;
        access_token?: string;
    };

    type PageParams = {
        current?: number;
        pageSize?: number;
    };

    type RuleListItem = {
        key?: number;
        disabled?: boolean;
        href?: string;
        avatar?: string;
        name?: string;
        owner?: string;
        desc?: string;
        callNo?: number;
        status?: number;
        updatedAt?: string;
        createdAt?: string;
        progress?: number;
    };

    type UserList = {
        data: {
            elements: CurrentUser[];
            paging: {
                total: number;
            };
        };
        /** 列表的内容总数 */
        total?: number;
        success?: string;
    };

    type RuleList = {
        data?: RuleListItem[];
        /** 列表的内容总数 */
        total?: number;
        success?: boolean;
    };

    type FakeCaptcha = {
        code?: number;
        status?: string;
    };

    type LoginParams = {
        username?: string;
        password?: string;
    };

    type ErrorResponse = {
        /** 业务约定的错误码 */
        errorCode: string;
        /** 业务上的错误信息 */
        errorMessage?: string;
        /** 业务上的请求是否成功 */
        success?: boolean;
    };

    type NoticeIconList = {
        data?: NoticeIconItem[];
        /** 列表的内容总数 */
        total?: number;
        success?: boolean;
    };

    type NoticeIconItemType = 'notification' | 'message' | 'event';

    type NoticeIconItem = {
        id?: string;
        extra?: string;
        key?: string;
        read?: boolean;
        avatar?: string;
        title?: string;
        status?: string;
        datetime?: string;
        description?: string;
        type?: NoticeIconItemType;
    };
}
