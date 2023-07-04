import {Button, Card, Input, List, message, Space, Tag} from 'antd';
import { useRequest } from 'umi';
import React, { useState } from 'react';
import styles from './index.less';
import {deleteTeam, queryMyCreateTeam,  quitTeam} from "@/services/ant-design-pro/api";
import {API} from "@/services/ant-design-pro/typings";
import {teamAvatar} from "@/constant/avatar";
import { history } from 'umi';


const MyCreate: React.FC = (props) => {
  const [visible,setVisible]=useState<boolean>(false)
  const { match } = props;
  // 获取tab列表数据
  const { data: listData ,run} = useRequest(() => {
    // return queryFakeList({
    //   count: 30,
    // });
    return  queryMyCreateTeam({
      currentPage: 1,
    });
  });

  const showButton= true;
  const quit= async (e,teamId :number)=>{
    e.stopPropagation();
    const TeamQuitRequest={
      teamId:teamId
    }
    const response=await quitTeam(TeamQuitRequest);
    if(response && response.code===0){
      message.success("退出队伍成功");
      run();
    }
  }

  const deleTeam = async (e,teamId: number) => {
    e.stopPropagation()
    const response = await deleteTeam({id: teamId});
    if (response && response.code === 0) {
      message.success("解散队伍成功");
      run();
    }
  }

  const editTeam=async (item)=>{
    history.push({
      pathname: '/form/edit-team',
      query: item
    });
  }

  const getTeamTag = (status: number) => {
    if (status === 0) {
      return '公开'
    } else if (status === 1) {
      return '私有'
    } else if (status === 2) {
      return '加密'
    }
    return 'error'
  }

  return (
    <List<API.TeamUserVO>
      className={styles.coverCardList}
      rowKey="id"
      grid={{ gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
      dataSource={listData || []}
      renderItem={(item) => (
        <List.Item>
          <Card className={styles.card} hoverable  onClick={()=>editTeam(item)} cover={<img alt={item.name} src={teamAvatar} width={200} height={200}/>}>
            <Card.Meta title={ <div>
              <Space size={"small"}>
                <a>{item.name}</a>
                <Tag color='gold' style={{fontSize:'10px'}} >{getTeamTag(item.status)}</Tag>
              </Space>
            </div>} description={'队伍描述：'+item.description} />
            <div className={styles.cardItemContent}>
              <span>{'队伍人数:'+item.hasJoinNum+'/'+item.maxNum}</span>
              <Space>
                {showButton && <Button type="primary" ghost  size={'small'}  onClick={(e)=>quit(e,item.id)}>退出</Button>}
                {showButton && <Button type="primary"  ghost danger size={'small'} onClick={(e)=>deleTeam(e,item.id)} >解散</Button>}
              </Space>
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default MyCreate;
