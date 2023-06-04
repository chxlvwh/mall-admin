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

export async function getBrandList(params: { current?: number; pageSize?: number }, options?: { [key: string]: any }) {
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

/** 新建用户 POST /api/rule */
export async function addBrand(body: API.Brand, options?: { [key: string]: any }) {
    return request<API.Brand>('/api/v1/brand', {
        method: 'POST',
        data: body,
        ...(options || {}),
    });
}

/** 新建用户 POST /api/rule */
export async function updateBrand(id: number, body: API.Brand, options?: { [key: string]: any }) {
    return request<API.Brand>(`/api/v1/brand/${id}`, {
        method: 'PUT',
        data: body,
        ...(options || {}),
    });
}

/** 根据Id查询用户 GET /api/rule */
export async function getBrandById(id: number, options?: { [key: string]: any }) {
    return request<API.Resp<API.Brand>>(`/api/v1/brand/${id}`, {
        method: 'GET',
        ...(options || {}),
    });
}

/** 根据Id查询用户 GET /api/rule */
export async function deleteBrand(id: number, options?: { [key: string]: any }) {
    return request<API.Resp<API.Brand>>(`/api/v1/brand/${id}`, {
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

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
    return request<API.NoticeIconList>('/api/notices', {
        method: 'GET',
        ...(options || {}),
    });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
    params: {
        // query
        /** 当前的页码 */
        current?: number;
        /** 页面的容量 */
        pageSize?: number;
    },
    options?: { [key: string]: any },
) {
    return request<API.RuleList>('/api/rule', {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
    return request<API.RuleListItem>('/api/rule', {
        method: 'PUT',
        ...(options || {}),
    });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
    return request<API.RuleListItem>('/api/rule', {
        method: 'POST',
        ...(options || {}),
    });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
    return request<Record<string, any>>('/api/rule', {
        method: 'DELETE',
        ...(options || {}),
    });
}
