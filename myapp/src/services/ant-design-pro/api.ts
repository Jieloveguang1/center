// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import {API} from "@/services/ant-design-pro/typings";

/** 获取当前的用户 GET /account/current */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/server/current', {
    method: 'GET',
    ...(options || {}),
  });
}
/** 获取用户id查询 GET /account/current */
export async function searchUserById(id:number,options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>(`/api/user/search/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}


/** 退出登录接口 POST /account/logout*/
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/server/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/server/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 注册接口 POST /api/user/register */
export async function register(body: API.RegisterParams, options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.RegisterResult>>('/server/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**标签更新接口*/
export async function updateTags(body: API.UserTagRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/api/user/update/tags', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**用户基础信息更新接口*/
export async function updateUser(body: API.CurrentUser, options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/api/user/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**创建队伍接口
 *
 * @param body
 * @param options
 */
export async function createTeam(params) {
  return request<API.BaseResponse<number>>('/team/add', {
    method: 'GET',
    params,
  });
}
/**获取退出队伍接口*/
export async function quitTeam(body: API.TeamQuitRequest,  options?: { [key: any]: any }) {
  // @ts-ignore
  return request<API.BaseResponse<boolean>>('/team/quit', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
/**获取解散队伍接口*/
export async function deleteTeam(body: API.TeamQuitRequest,  options?: { [key: any]: any }) {
  // @ts-ignore
  return request<API.BaseResponse<boolean>>('/team/delete', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
/**获取更新队伍接口*/
export async function updateTeam(body: API.TeamAddRequest,  options?: { [key: any]: any }) {
  // @ts-ignore
  return request<API.BaseResponse<boolean>>('/team/update', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/**加入队伍接口*/
export async function joinTeam(body: any,  options?: { [key: any]: any }) {
  // @ts-ignore
  return request<API.BaseResponse<boolean>>('/team/join', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
/**当前用户是否在队伍中*/
export async function isInTeam(params) {
  // @ts-ignore
  return request<API.BaseResponse<boolean>>('/team/in', {
    method: 'GET',
    params,
  });
}

/**获取我加入队伍接口*/
export async function queryMyJoinTeam(body: { currentPage: number }, options?: { [p: string]: any }) {
  // @ts-ignore
  return request<API.BaseResponse<List<API.TeamUserVO>>>('/team/list/my/join', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
/**获取我创建队伍接口*/
export async function queryMyCreateTeam( options?: { [p: string]: any }) {
  // @ts-ignore
  return request<API.BaseResponse<List<API.TeamUserVO>>>('/team/list/my/create', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}
/**获取队伍接口*/
export async function queryTeams(params) {
  // @ts-ignore
  return request<API.BaseResponse<List<API.TeamUserVO>>>('/team/list', {
    method: 'GET',
    params,
  });
}
/**条件查询用户接口*/
export async function queryUser(body: API.UserQuery, options?: { [key: string]: any }) {
  return request<API.BaseResponse<List<API.CurrentUser>>>('/api/user/searchByCondition', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**匹配推荐用户接口*/
export async function matchUsers( options?: { [key: string]: any }) {
  return request<API.BaseResponse<List<API.CurrentUser>>>('/api/user/match', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
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
