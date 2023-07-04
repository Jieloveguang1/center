import { request } from 'umi';
import type { CurrentUser, ListItemDataType } from './data.d';
import {currentUser, searchUserById} from "@/services/ant-design-pro/api";
import {API} from "@/services/ant-design-pro/typings";

export async function queryCurrent(): Promise<{ data: API.CurrentUser }> {
  // return request('/api/currentUserDetail');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const currentUerResponse=await currentUser();
  let id:number =currentUerResponse.data.id
  const realUser=await searchUserById(id);
  const tags=realUser.data.tags
  let parsedTags =[];
  console.log(currentUerResponse?.data);
  if(tags){
    try{
      parsedTags=JSON.parse(tags);
    }catch (error){
      console.log('tags error')
    }
  }
  console.log(parsedTags);
  return {data:{...currentUerResponse.data , parsedTags}};
}

export async function queryFakeList(params: {
  count: number;
}): Promise<{ data: { list: ListItemDataType[] } }> {
  return request('/api/fake_list_Detail', {
    params,
  });
}
