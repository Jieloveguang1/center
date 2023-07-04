// @ts-ignore
/* eslint-disable */

import {List} from "antd";

declare namespace API {

  type CurrentUser = {
    id: number;
    username: string;
    userAccount: string;
    avatarUrl?: string;
    gender:number;
    phone: string;
    email: string;
    userStatus: number;
    userRole: number;
    planetCode: string;
    tags: string
    createTime: Date;
    parsedTags?: string[]
  };

  type TeamQuitRequest ={
    teamId :number;
  };

  type UserTagRequest = {
    parsedTags: string[];
  };

  type RegisterResult = number;

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  /**
   * 通用返回类
   */
  type BaseResponse<T> = {
    code: number,
    data: T,
    message: string,
    description: string,
  }

  /**
   * 我加入的队伍请求参数
   */
  type  TeamQuery = {
    id: number,
    idList: List<number>,
    searchText: string,
    name: string,
    description: string
    maxNum: number,
    userId: number,
    status: number,
    currentPage: number,
    pageSize: number,
  };


  type TeamUserVO = {
    id: number,
    name: string,
    description: string,
    maxNum: number,
    expireTime: Date,
    userId: number,
    status: number,
    createTime: Date,
    updateTime: Date,
    createUser: CurrentUser,
    hasJoinNum: number,
    hasJoin: false
  }

  type TeamAddRequest = {
    name: string,
    description: string,
    maxNum: number,
    expireTime: Date,
    status: number,
  }

 type UserQuery= {
   id: number,
   idList: List<number>,
   searchText: string,
   username: string,
   gender: number,
   userAccount: string,
   tagsName: List<string>,
   currentPage: number,
   pageSize: number,
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
    userAccount?: string;
    userPassword?: string;
    autoLogin?: boolean;
    type?: string;
  };


  type RegisterParams = {
    userAccount?: string;
    userPassword?: string;
    checkPassword?: string;
    planetCode?: string;
    type?: string;
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
