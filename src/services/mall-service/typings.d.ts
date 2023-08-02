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

    type CouponItem = {
        id: number;
        code: string;
        usedDate: Date;
        receivedDate: Date;
        user: CurrentUser;
        coupon: Coupon;
    };

    type Coupon = {
        id: number;
        name: string;
        type: string;
        status: string;
        threshold: number;
        value: number;
        startDate: Date;
        endDate: Date;
        quantity: number;
        quantityPerUser: number;
        scope: string;
        products: Product[];
        productIds?: number[] | string[];
        categoryIds?: number[] | string[];
        categories: Category[];
        couponItems: CouponItem[];
    } & CommonDate;

    type Category = {
        id: number;
        name: string;
        parentId?: number;
        productIds?: number[];
        desc?: string;
        picture?: string;
        icon?: string;
        order?: number;
        isActive?: boolean;
        products?: Product[];
        parent?: Category;
        children?: Category[];
        productAttributes?: Attribute[];
        deletedAt?: Date;
    } & CommonDate;

    type Sku = {
        id?: number;
        price: number;
        stock: number;
        props: { name: string; value: string }[];
        code: string;
        product: Product;
    } & CommonDate;

    type Product = {
        id: number;
        name: string;
        itemNo: string;
        subtitle: string;
        introduction: string;
        originPrice: number;
        salePrice: number;
        stock: number;
        status: number;
        unit: string;
        content: string;
        weight: number;
        brandId: number;
        brand: Brand;
        productCategoryId: number;
        productCategory: Category;
        skus: Sku[];
        coverUrls: string[];
        deletedAt?: Date;
        props?: any[];
    } & CommonDate;

    type Receiver = {
        id: number;
        name: string;
        phone: string;
        address: string;
        houseNo: string;
        addressName: string;
        province: string;
        city: string;
        region: string;
        zip: string;
        isDefault: boolean;
        user: CurrentUser;
        orders: Order[];
    };

    type OrderItem = {
        id: number;
        quantity: number;
        discountedPrice: number;
        status: string;
        coupon: Coupon[];
        order: Order;
        product: Product;
        sku: Sku;
    };

    type OrderStatus = 'UNPAID' | 'DELIVERING' | 'DELIVERED' | 'COMPLETED' | 'CLOSED';

    type Order = {
        id: string;
        orderNo: string;
        paymentMethod: string;
        orderSource: string;
        status: OrderStatus;
        remark: string;
        deliveryNo: string;
        logisticsCompany: string;
        logisticsNo: string;
        autoReceiveDate: Date;
        createdAt: Date;
        paymentTime: Date;
        deliveryTime: Date;
        receiveTime: Date;
        commentTime: Date;
        lastModifiedAt: Date;
        deletedAt?: Date;
        totalPrice: number;
        user: CurrentUser;
        receiver: Receiver;
        items: OrderItem[];
        generalCoupon: Coupon[];
    } & CommonDate;

    type Attribute = {
        id: number;
        name: string;
        desc?: string;
        entryMethod: number;
        isRequired: boolean;
        canSearch: boolean;
        type: number;
        value: string;
        displayName: string;
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
