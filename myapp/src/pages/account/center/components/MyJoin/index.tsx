import {Button, Card, Image, List, message, Space, Tag} from 'antd';
import { useRequest } from 'umi';
import React from 'react';
import moment from 'moment';
import { queryFakeList } from '../../service';
import AvatarList from '../AvatarList';
import type { ListItemDataType } from '../../data.d';
import styles from './index.less';
import { DownloadOutlined } from '@ant-design/icons';
import {queryMyJoinTeam, quitTeam} from "@/services/ant-design-pro/api";
import {API} from "@/services/ant-design-pro/typings";
import {teamAvatar} from "@/constant/avatar";

const MyJoin: React.FC = () => {
  // 获取tab列表数据
  const { data: listData,run } = useRequest(() => {
    // return queryFakeList({
    //   count: 30,
    // });
    return  queryMyJoinTeam({
      currentPage: 1,
    });
  });

  const showButton= true;
  const quit= async (teamId :number)=>{
    const TeamQuitRequest={
      teamId:teamId
    }
    const response=await quitTeam(TeamQuitRequest);
    if(response && response.code===0){
      message.success("退出队伍成功");
      run();
    }
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
          <Card className={styles.card} hoverable cover={<img alt={item.name} src={teamAvatar} width={200} height={200}/>}>
            <Card.Meta title={ <div>
              <Space size={"small"}>
                <a>{item.name}</a>
                <Tag color='gold' style={{fontSize:'10px'}} >{getTeamTag(item.status)}</Tag>
              </Space>
            </div>} description={'队伍描述：'+item.description} />
            <div className={styles.cardItemContent}>
              <span>{'队伍人数:'+item.hasJoinNum+'/'+item.maxNum}</span>
              <Space>
                {showButton && <Button type="primary" ghost  size={'small'} v-if='false' onClick={()=>quit(item.id)}>退出</Button>}
                {false && <Button type="primary" ghost  size={'small'} >加入</Button>}
                {false && <Button type="primary"  ghost danger size={'small'} >解散</Button>}
              </Space>

            </div>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default MyJoin;
