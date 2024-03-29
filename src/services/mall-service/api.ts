// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
    return request<{
        data: API.CurrentUser;
    }>('/api/v1/admin/user/info', {
        method: 'GET',
        ...(options || {}),
    });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
    return request<API.LoginResult>('/api/v1/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

export async function user(params: { current?: number; pageSize?: number }, options?: { [key: string]: any }) {
    const result = await request<API.RestList<API.CurrentUser>>('/api/v1/admin/user/list', {
        method: 'GET',
        params: { ...params },
        ...(options || {}),
    });
    console.log('[api.ts:] ', result);
    return {
        data: result.data.elements,
        total: result.data.paging.total,
        success: true,
    };
}

/** 新建用户 POST /api/rule */
export async function addUser(body: API.UserForm, options?: { [key: string]: any }) {
    return request<API.CurrentUser>('/api/v1/admin/user', {
        method: 'POST',
        data: body,
        ...(options || {}),
    });
}

/** 根据Id查询用户 GET /api/rule */
export async function getUserById(id: number, options?: { [key: string]: any }) {
    return request<API.Resp<API.CurrentUser>>(`/api/v1/admin/user/${id}`, {
        method: 'GET',
        ...(options || {}),
    });
}

/** 更新用户 POST /api/rule */
export async function updateUser(id: number, body: API.UserForm, options?: { [key: string]: any }) {
    return request<API.Resp<API.CurrentUser>>(`/api/v1/admin/user/${id}`, {
        method: 'PUT',
        data: body,
        ...(options || {}),
    });
}

/**
 * 删除用户
 */
export async function deleteUser(id: number, options?: { [key: string]: any }) {
    return request<API.Resp<API.CurrentUser>>(`/api/v1/admin/user/${id}`, {
        method: 'DELETE',
        ...(options || {}),
    });
}

/**
 * 恢复用户
 */
export async function restoreUser(id: number, options?: { [key: string]: any }) {
    return request<API.Resp<API.CurrentUser>>(`/api/v1/admin/user/${id}/restore`, {
        method: 'PUT',
        ...(options || {}),
    });
}

export async function getCategoryAttrs(id: number, options?: { [key: string]: any }) {
    return request<API.Resp<API.Attribute[]>>(`/api/v1/product-category/${id}/attributes`, {
        method: 'GET',
        ...(options || {}),
    });
}

export async function getAttrList(
    params: { current?: number; pageSize?: number } & Partial<API.Attribute>,
    options?: { [key: string]: any },
) {
    const result = await request<API.RestList<API.Attribute>>('/api/v1/product-attribute/list', {
        method: 'GET',
        params,
        ...(options || {}),
    });
    return {
        data: result.data.elements,
        total: result.data.paging.total,
        success: true,
    };
}

export async function addAttr(body: API.Attribute, options?: { [key: string]: any }) {
    return request<API.Attribute>('/api/v1/product-attribute', {
        method: 'POST',
        data: body,
        ...(options || {}),
    });
}

export async function updateAttr(id: number, body: API.Attribute, options?: { [key: string]: any }) {
    return request<API.Attribute>(`/api/v1/product-attribute/${id}`, {
        method: 'PUT',
        data: body,
        ...(options || {}),
    });
}

export async function getAttrById(id: number, options?: { [key: string]: any }) {
    return request<API.Resp<API.Attribute>>(`/api/v1/product-attribute/${id}`, {
        method: 'GET',
        ...(options || {}),
    });
}

export async function deleteAttr(id: number, options?: { [key: string]: any }) {
    return request<API.Resp<API.Attribute>>(`/api/v1/product-attribute/${id}`, {
        method: 'DELETE',
        ...(options || {}),
    });
}

export async function getBrandList(
    params: { current?: number; pageSize?: number } & Partial<API.Brand>,
    options?: { [key: string]: any },
) {
    const result = await request<API.RestList<API.Brand>>('/api/v1/brand/list', {
        method: 'GET',
        params,
        ...(options || {}),
    });
    return {
        data: result.data.elements,
        total: result.data.paging.total,
        success: true,
    };
}

export async function addBrand(body: API.Brand, options?: { [key: string]: any }) {
    return request<API.Brand>('/api/v1/brand', {
        method: 'POST',
        data: body,
        ...(options || {}),
    });
}

export async function updateBrand(id: number, body: API.Brand, options?: { [key: string]: any }) {
    return request<API.Brand>(`/api/v1/brand/${id}`, {
        method: 'PUT',
        data: body,
        ...(options || {}),
    });
}

export async function getBrandById(id: number, options?: { [key: string]: any }) {
    return request<API.Resp<API.Brand>>(`/api/v1/brand/${id}`, {
        method: 'GET',
        ...(options || {}),
    });
}

export async function deleteBrand(id: number, options?: { [key: string]: any }) {
    return request<API.Resp<API.Brand>>(`/api/v1/brand/${id}`, {
        method: 'DELETE',
        ...(options || {}),
    });
}

export async function getCategoryTree(options?: { [key: string]: any }) {
    return await request<API.Resp<API.Category[]>>('/api/v1/product-category/tree', {
        method: 'GET',
        ...(options || {}),
    });
}

export async function getCategoryAncestorTree(id: number, options?: { [key: string]: any }) {
    return await request<API.Resp<API.Category[]>>(`/api/v1/product-category/tree/ancestors/${id}`, {
        method: 'GET',
        ...(options || {}),
    });
}

export async function getCategoryList(
    params: { current?: number; pageSize?: number },
    options?: { [key: string]: any },
) {
    const result = await request<API.RestList<API.Category>>('/api/v1/product-category', {
        method: 'GET',
        params,
        ...(options || {}),
    });
    return {
        data: result.data.elements,
        total: result.data.paging.total,
        success: true,
    };
}

export async function getCategoryById(id: number, options?: { [key: string]: any }) {
    return request<API.Resp<API.Category>>(`/api/v1/product-category/${id}`, {
        method: 'GET',
        ...(options || {}),
    });
}

/** 新建用户 POST /api/v1/product-category */
export async function addCategory(body: API.Category, options?: { [key: string]: any }) {
    return request<API.Brand>('/api/v1/product-category', {
        method: 'POST',
        data: body,
        ...(options || {}),
    });
}

/** 新建用户 POST /api/rule */
export async function updateCategory(id: number, body: Partial<API.Category>, options?: { [key: string]: any }) {
    return request<API.Brand>(`/api/v1/product-category/${id}`, {
        method: 'PUT',
        data: body,
        ...(options || {}),
    });
}

/** 新建用户 POST /api/rule */
export async function updateCategoryAttr(
    id: number,
    body: { attributeIds: number[] },
    options?: { [key: string]: any },
) {
    return request<API.Brand>(`/api/v1/product-category/${id}/attributes`, {
        method: 'PUT',
        data: body,
        ...(options || {}),
    });
}

/** 根据Id查询用户 GET /api/rule */
export async function deleteCategory(id: number, options?: { [key: string]: any }) {
    return request<API.Resp<API.Brand>>(`/api/v1/product-category/${id}`, {
        method: 'DELETE',
        ...(options || {}),
    });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
    return request<Record<string, any>>('/api/admin/user/login', {
        method: 'POST',
        ...(options || {}),
    });
}

export async function getProductList(params: API.PageParams & Partial<API.Product>, options?: { [key: string]: any }) {
    const result = await request<API.RestList<API.Product>>('/api/v1/product', {
        method: 'GET',
        params,
        ...(options || {}),
    });
    return {
        data: result.data.elements,
        total: result.data.paging.total,
        success: true,
    };
}

export async function getProductById(id: number | string, options?: { [key: string]: any }) {
    return request<API.Resp<API.Product>>(`/api/v1/product/${id}`, {
        method: 'GET',
        ...(options || {}),
    });
}

export async function addProduct(body: Partial<API.Product>, options?: { [key: string]: any }) {
    return request<API.Product>('/api/v1/product', {
        method: 'POST',
        data: body,
        ...(options || {}),
    });
}

export async function updateProduct(id: number, body: Partial<API.Product>, options?: { [key: string]: any }) {
    return request<API.Product>(`/api/v1/product/${id}`, {
        method: 'PUT',
        data: body,
        ...(options || {}),
    });
}

export async function setProductOnSale(id: number, options?: { [key: string]: any }) {
    return request<API.Product>(`/api/v1/product/${id}/status/on-sale`, {
        method: 'PUT',
        ...(options || {}),
    });
}

export async function setProductOffSale(id: number, options?: { [key: string]: any }) {
    return request<API.Product>(`/api/v1/product/${id}/status/off-sale`, {
        method: 'PUT',
        ...(options || {}),
    });
}

export async function deleteProduct(id: number, options?: { [key: string]: any }) {
    return request<API.Resp<API.Product>>(`/api/v1/product/${id}`, {
        method: 'DELETE',
        ...(options || {}),
    });
}

// 优惠券列表
export async function getCouponList(params: API.PageParams & Partial<API.Coupon>, options?: { [key: string]: any }) {
    const result = await request<API.RestList<API.Coupon>>('/api/v1/coupon', {
        method: 'GET',
        params,
        ...(options || {}),
    });
    return {
        data: result.data.elements,
        total: result.data.paging.total,
        success: true,
    };
}

// 优惠券详情
export async function getCouponById(id: number | string, options?: { [key: string]: any }) {
    return request<API.Resp<API.Coupon>>(`/api/v1/coupon/${id}`, {
        method: 'GET',
        ...(options || {}),
    });
}

// 新增优惠券
export async function addCoupon(body: Partial<API.Coupon>, options?: { [key: string]: any }) {
    return request<API.Coupon>('/api/v1/coupon', {
        method: 'POST',
        data: body,
        ...(options || {}),
    });
}

// 更新优惠券
export async function updateCoupon(id: number, body: Partial<API.Coupon>, options?: { [key: string]: any }) {
    return request<API.Coupon>(`/api/v1/coupon/${id}`, {
        method: 'PUT',
        data: body,
        ...(options || {}),
    });
}

// 删除优惠券
export async function deleteCoupon(id: number, options?: { [key: string]: any }) {
    return request<API.Resp<API.Coupon>>(`/api/v1/coupon/${id}`, {
        method: 'DELETE',
        ...(options || {}),
    });
}

// 查询order列表
export async function getOrderList(
    params: API.PageParams & Partial<API.Order> & { withLogistic?: boolean },
    options?: { [key: string]: any },
) {
    const result = await request<API.RestList<API.Order>>('/api/v1/order', {
        method: 'GET',
        params,
        ...(options || {}),
    });
    return {
        data: result.data.elements,
        total: result.data.paging.total,
        success: true,
    };
}

// 查询order详情
export async function getOrderByOrderNo(orderNo: string, options?: { [key: string]: any }) {
    return request<API.Resp<API.Order>>(`/api/v1/order/${orderNo}`, {
        method: 'GET',
        ...(options || {}),
    });
}

/** 取消订单 */
export async function cancelOrder(orderNo: string, options?: { [key: string]: any }) {
    return request<API.Resp<API.Order>>(`/api/v1/order/${orderNo}/cancel`, {
        method: 'PUT',
        ...(options || {}),
    });
}

/** 删除订单 */
export async function deleteOrder(orderNo: string, options?: { [key: string]: any }) {
    return request<API.Resp<API.Order>>(`/api/v1/order/${orderNo}`, {
        method: 'DELETE',
        ...(options || {}),
    });
}

/** 更新订单 */
export async function updateOrder(orderNo: string, body: Partial<API.Order>, options?: { [key: string]: any }) {
    return request<API.Order>(`/api/v1/order/${orderNo}`, {
        method: 'PUT',
        data: body,
        ...(options || {}),
    });
}

/** 新增退款原因 */
export async function addRefundReason(body: Partial<API.RefundReason>, options?: { [key: string]: any }) {
    return request<API.RefundReason>('/api/v1/refund-reason', {
        method: 'POST',
        data: body,
        ...(options || {}),
    });
}

/** 更新退款原因 */
export async function updateRefundReason(
    id: number,
    body: Partial<API.RefundReason>,
    options?: { [key: string]: any },
) {
    return request<API.RefundReason>(`/api/v1/refund-reason/${id}`, {
        method: 'PUT',
        data: body,
        ...(options || {}),
    });
}

/** 删除退款原因 */
export async function deleteRefundReason(id: number, options?: { [key: string]: any }) {
    return request<API.Resp<API.RefundReason>>(`/api/v1/refund-reason/${id}`, {
        method: 'DELETE',
        ...(options || {}),
    });
}

/** 获取退款原因列表 */
export async function getRefundReasonList(options?: { [key: string]: any }) {
    return request<API.Resp<API.RefundReason[]>>('/api/v1/refund-reason', {
        method: 'GET',
        ...(options || {}),
    });
}
/** 根据id获取退款原因 */
export async function getRefundReasonById(id: number, options?: { [key: string]: any }) {
    return request<API.Resp<API.RefundReason>>(`/api/v1/refund-reason/${id}`, {
        method: 'GET',
        ...(options || {}),
    });
}

/** 查询订单设置 */
export async function getOrderSetting(options?: { [key: string]: any }) {
    return request<API.Resp<API.OrderSetting[]>>('/api/v1/order-setting', {
        method: 'GET',
        ...(options || {}),
    });
}

/** 批量更新订单设置 */
export async function updateOrderSetting(body: Partial<API.OrderSetting>[], options?: { [key: string]: any }) {
    return request<API.Resp<API.OrderSetting[]>>(`/api/v1/order-setting/bulk`, {
        method: 'PUT',
        data: body,
        ...(options || {}),
    });
}

/** 查询物流公司列表 */
export async function getLogisticList(options?: { [key: string]: any }) {
    return request<API.Resp<API.Logistic[]>>('/api/v1/order/logistic', {
        method: 'GET',
        ...(options || {}),
    });
}

/** 订单发货 */
export async function orderDeliver(
    orderNo: string,
    body: { logisticCompanyId: number; logisticNo: string },
    options?: { [key: string]: any },
) {
    return request<API.Resp<API.Order>>(`/api/v1/order/${orderNo}/deliver`, {
        method: 'PUT',
        data: body,
        ...(options || {}),
    });
}

/** 更新订单发货信息 */
export async function updateDeliverOrder(
    orderNo: string,
    body: { logisticCompanyId: number; logisticNo: string },
    options?: { [key: string]: any },
) {
    return request<API.Resp<API.Order>>(`/api/v1/order/${orderNo}/updateDeliveryInfo`, {
        method: 'PUT',
        data: body,
        ...(options || {}),
    });
}

/** 查询品牌推荐列表 */
export async function getRecommendBrandList(
    params: API.PageParams & Partial<API.RecommendBrand>,
    options?: { [key: string]: any },
) {
    const result = await request<API.RestList<API.RecommendBrand>>('/api/v1/recommend-brand', {
        method: 'GET',
        params,
        ...(options || {}),
    });
    return {
        data: result.data.elements,
        total: result.data.paging.total,
        success: true,
    };
}

/** 新增品牌推荐 */
export async function addRecommendBrand(body: { brandIds: number[] }, options?: { [key: string]: any }) {
    return request<API.RecommendBrand>('/api/v1/recommend-brand', {
        method: 'POST',
        data: body,
        ...(options || {}),
    });
}

/** 删除品牌推荐 */
export async function deleteRecommendBrand(id: number, options?: { [key: string]: any }) {
    return request<API.Resp<API.RecommendBrand>>(`/api/v1/recommend-brand/${id}`, {
        method: 'DELETE',
        ...(options || {}),
    });
}

/** 批量查询推荐品牌 */
export async function getRecommendBrandByIds(brandIds: number[], options?: { [key: string]: any }) {
    return request<API.Resp<API.RecommendBrand[]>>(`/api/v1/recommend-brand/getByBrandIds`, {
        method: 'GET',
        params: { brandIds },
        ...(options || {}),
    });
}

/** 更新品牌推荐 */
export async function updateRecommendBrand(
    id: number,
    body: Partial<API.RecommendBrand>,
    options?: { [key: string]: any },
) {
    return request<API.RecommendBrand>(`/api/v1/recommend-brand/${id}`, {
        method: 'PUT',
        data: body,
        ...(options || {}),
    });
}

/** 查询商品推荐列表 */
export async function getRecommendNewList(
    params: API.PageParams & Partial<API.RecommendNew>,
    options?: { [key: string]: any },
) {
    const result = await request<API.RestList<API.RecommendNew>>('/api/v1/recommend-new', {
        method: 'GET',
        params,
        ...(options || {}),
    });
    return {
        data: result.data.elements,
        total: result.data.paging.total,
        success: true,
    };
}

/** 新增商品推荐 */
export async function addRecommendNew(body: { productIds: number[] }, options?: { [key: string]: any }) {
    return request<API.RecommendNew>('/api/v1/recommend-new', {
        method: 'POST',
        data: body,
        ...(options || {}),
    });
}

/** 删除商品推荐 */
export async function deleteRecommendNew(id: number, options?: { [key: string]: any }) {
    return request<API.Resp<API.RecommendNew>>(`/api/v1/recommend-new/${id}`, {
        method: 'DELETE',
        ...(options || {}),
    });
}

/** 批量查询推荐商品 */
export async function getRecommendNewByIds(productIds: number[], options?: { [key: string]: any }) {
    return request<API.Resp<API.RecommendNew[]>>(`/api/v1/recommend-new/getByProductIds`, {
        method: 'GET',
        params: { productIds },
        ...(options || {}),
    });
}

/** 更新商品推荐 */
export async function updateRecommendNew(
    id: number,
    body: Partial<API.RecommendNew>,
    options?: { [key: string]: any },
) {
    return request<API.RecommendNew>(`/api/v1/recommend-new/${id}`, {
        method: 'PUT',
        data: body,
        ...(options || {}),
    });
}

/** 查询人气推荐列表 */
export async function getRecommendPopularList(
    params: API.PageParams & Partial<API.RecommendPopular>,
    options?: { [key: string]: any },
) {
    const result = await request<API.RestList<API.RecommendPopular>>('/api/v1/recommend-popular', {
        method: 'GET',
        params,
        ...(options || {}),
    });
    return {
        data: result.data.elements,
        total: result.data.paging.total,
        success: true,
    };
}

/** 新增人气推荐 */
export async function addRecommendPopular(body: { productIds: number[] }, options?: { [key: string]: any }) {
    return request<API.RecommendPopular>('/api/v1/recommend-popular', {
        method: 'POST',
        data: body,
        ...(options || {}),
    });
}

/** 删除人气推荐 */
export async function deleteRecommendPopular(id: number, options?: { [key: string]: any }) {
    return request<API.Resp<API.RecommendPopular>>(`/api/v1/recommend-popular/${id}`, {
        method: 'DELETE',
        ...(options || {}),
    });
}

/** 批量查询推荐人气 */
export async function getRecommendPopularByIds(productIds: number[], options?: { [key: string]: any }) {
    return request<API.Resp<API.RecommendPopular[]>>(`/api/v1/recommend-popular/getByProductIds`, {
        method: 'GET',
        params: { productIds },
        ...(options || {}),
    });
}

/** 更新人气推荐 */
export async function updateRecommendPopular(
    id: number,
    body: Partial<API.RecommendPopular>,
    options?: { [key: string]: any },
) {
    return request<API.RecommendPopular>(`/api/v1/recommend-popular/${id}`, {
        method: 'PUT',
        data: body,
        ...(options || {}),
    });
}

/** 查询秒杀活动列表 */
export async function getSeckillList(params: API.PageParams & Partial<API.Seckill>, options?: { [key: string]: any }) {
    const result = await request<API.RestList<API.RecommendPopular>>('/api/v1/seckill', {
        method: 'GET',
        params,
        ...(options || {}),
    });
    return {
        data: result.data.elements,
        total: result.data.paging.total,
        success: true,
    };
}

export async function getSeckillById(id: number, options?: { [key: string]: any }) {
    return request<API.Resp<API.Seckill>>(`/api/v1/seckill/${id}`, {
        method: 'GET',
        ...(options || {}),
    });
}

/** 新增秒杀活动列表 */
export async function addSeckill(body: Partial<API.Seckill>, options?: { [key: string]: any }) {
    return request<API.Resp<API.Seckill>>('/api/v1/seckill', {
        method: 'POST',
        data: body,
        ...(options || {}),
    });
}

/** 更新秒杀活动推荐 */
export async function updateSeckill(id: number, body: Partial<API.Seckill>, options?: { [key: string]: any }) {
    return request<API.Seckill>(`/api/v1/seckill/${id}`, {
        method: 'PUT',
        data: body,
        ...(options || {}),
    });
}

/** 更新秒杀活动推荐 */
export async function updateSeckillPeriod(
    id: number,
    periodId: number,
    body: Partial<API.SeckillPeriod>,
    options?: { [key: string]: any },
) {
    return request<API.Seckill>(`/api/v1/seckill/${id}/period/${periodId}`, {
        method: 'PUT',
        data: body,
        ...(options || {}),
    });
}

/** 删除秒杀活动推荐 */
export async function deleteSeckill(id: number, options?: { [key: string]: any }) {
    return request<API.Resp<API.Seckill>>(`/api/v1/seckill/${id}`, {
        method: 'DELETE',
        ...(options || {}),
    });
}

/** 删除时间段 */
export async function deleteSeckillPeriod(id: number, periodId: number, options?: { [key: string]: any }) {
    return request<API.Resp<API.SeckillPeriod>>(`/api/v1/seckill/${id}/period/${periodId}`, {
        method: 'DELETE',
        ...(options || {}),
    });
}

/** 给时间段关联商品 */
export async function addPeriodProducts(
    id: number,
    periodId: number,
    body: { productIds: number[] },
    options?: { [key: string]: any },
) {
    return request<API.Resp<API.SeckillPeriod>>(`/api/v1/seckill/${id}/period/${periodId}/periodProducts`, {
        method: 'PUT',
        data: body,
        ...(options || {}),
    });
}

/** 获取时间段关联商品 */
export async function getPeriodProducts(params: { id: number; periodId: number }, options?: { [key: string]: any }) {
    return request<API.Resp<API.PeriodProduct[]>>(
        `/api/v1/seckill/${params.id}/period/${params.periodId}/periodProducts`,
        {
            method: 'GET',
            ...(options || {}),
        },
    );
}

/** 删除时间段关联商品 */
export async function deletePeriodProduct(
    params: {
        id: number | string;
        periodId: number | string;
        periodProductId: number | string;
    },
    options?: { [key: string]: any },
) {
    return request<API.Resp<API.SeckillPeriod>>(
        `/api/v1/seckill/${params.id}/period/${params.periodId}/periodProduct/${params.periodProductId}`,
        {
            method: 'DELETE',
            ...(options || {}),
        },
    );
}

/** 更新时间段商品 */
export async function updatePeriodProduct(
    params: {
        id: number | string;
        periodId: number | string;
        periodProductId: number | string;
    },
    body: Partial<API.PeriodProduct>,
    options?: { [key: string]: any },
) {
    return request<API.Resp<API.SeckillPeriod>>(
        `/api/v1/seckill/${params.id}/period/${params.periodId}/periodProduct/${params.periodProductId}`,
        {
            method: 'PUT',
            data: body,
            ...(options || {}),
        },
    );
}
