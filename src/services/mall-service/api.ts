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
export async function getOrderList(params: API.PageParams & Partial<API.Order>, options?: { [key: string]: any }) {
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
