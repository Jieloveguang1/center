import { request } from 'umi';
import type { CurrentUser, GeographicItemType } from './data';
import {currentUser} from "@/services/ant-design-pro/api";

export async function queryCurrent(): Promise<{ data: API.CurrentUser }> {
  // return request('/api/accountSettingCurrentUser');
  const currentResponse= await currentUser();
  return currentResponse
}

export async function queryProvince(): Promise<{ data: GeographicItemType[] }> {
  return request('/api/geographic/province');
}

export async function queryCity(province: string): Promise<{ data: GeographicItemType[] }> {
  return request(`/api/geographic/city/${province}`);
}

export async function query() {
  return request('/api/users');
}
