// @ts-ignore
/* eslint-disable */

declare namespace API {
    type CommonDate = {
        createdAt?: Date;
        lastModified?: Date;
    };

    type CurrentUser = {
        id: number;
        password: string;
        username?: string;
        deletedAt?: Date;
        profile?: Profile;
        logs?: object[];
        roles?: object[];
    } & CommonDate;

    type Brand = {
        id: number;
        name: string;
        desc: string;
    } & CommonDate;

    type Category = {
        id: number;
        name: string;
        parentId?: number;
        desc?: string;
        icon?: string;
        order?: number;
        isActive?: boolean;
        products?: Product[];
        parent?: Category;
        children?: Category[];
        deletedAt?: Date;
    } & CommonDate;

    type Attribute = {
        id: number;
        name: string;
        entryMethod: number;
        isRequired: boolean;
        canSearch: boolean;
        type: number;
        value: string;
        productCategory: ProductCategory[];
        deletedAt?: Date;
    } & CommonDate;

    type Resp<T> = {
        code: number;
        data: T;
        message: string;
    };

    type Profile = {
        id?: number;
        gender?: number;
        nickname?: string;
        email?: string;
        avatar?: string;
        address?: string;
        remark?: string;
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

    type RestList<T> = {
        data: {
            elements: T[];
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
