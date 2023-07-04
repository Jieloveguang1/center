import {Button, Card, Col, Form, List, message, Row, Select, Space, Tag} from 'antd';
import type { FC } from 'react';
import {useLocation, useRequest} from 'umi';
import StandardFormRow from './components/StandardFormRow';
import styles from './style.less';
import {isInTeam, joinTeam, queryTeams} from "@/services/ant-design-pro/api";
import {API} from "@/services/ant-design-pro/typings";
import {teamAvatar} from "@/constant/avatar";
import  {useEffect, useState} from "react";
import Modal from 'antd/lib/modal/Modal';

const { Option } = Select;
const FormItem = Form.Item;




const Projects: FC = () => {
  const location = useLocation();
  const{searchText}=location?.query;
  const [filterTeams,setFilterTeams]=useState([])
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [refreshTag,setRefreshTag]=useState(false);
  const [tempTeam,setTempTeam]=useState<API.TeamUserVO>()
  const {data:data, loading, run} = useRequest((values: any) => {
    console.log('form data', values);
    // return queryFakeList({
    //   count: 8,
    // });
    console.log(searchText)
    const response=queryTeams({...values,'searchText':searchText});
    console.log('data:'+data)
    return response
  });


  useEffect((values)=>{
    run(values)
  },[searchText])

  useEffect((values)=>{
    if(refreshTag===true) run(values)
    setRefreshTag(false)
  },[refreshTag])

  useEffect(()=>{
   if(data){
     const fetchData = async () => {
       const filteredList: API.TeamUserVO[] = [];
       for (const team of data || []) {
         const teamId: number = team.id;
         const res = await isInTeam({ teamId });
         console.log('isInteam:', res.data);
         if (res.data === false && team.status!==1) {
           filteredList.push(team);
         }
       }
       setFilterTeams(filteredList);
     };
     fetchData();
   }
  },[data])


  const join = async (item)=>{
    setTempTeam(item);
    if(item.status === 2){
      setOpen(true)
    }
    else{
     const res= await joinTeam({'teamId':item.id,'password':password})
     if(res.data===true) {
       setRefreshTag(true)
       message.success('加入成功')
     }else{
       message.error(res.description)
     }
    }
    console.log('join');
  }

  const list = filterTeams || []

  const confirmSubmit = async () => {
    console.log(tempTeam)
    const res= await joinTeam({'teamId':tempTeam?.id,'password':password})
    if(res.data===true) {
      setRefreshTag(true)
      message.success('加入成功')
    }else{
      message.error(res.description)
    }
    setPassword('')
    setOpen(false);
  };

  const hideModal=()=>{
    setPassword('')
    setOpen(false)
  }
  const handlePasswordChange=(event)=>{
    setPassword(event.target.value)
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
  const cardList = list && (
    <List<API.TeamUserVO>
      rowKey="id"
      loading={loading}
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 3,
        lg: 3,
        xl: 4,
        xxl: 4,
      }}
      dataSource={list}
      renderItem={(item) => (
        <List.Item>
          <Card className={styles.card} hoverable cover={<img alt={item.name} src={teamAvatar} width={200} height={200}/>}>
            <Card.Meta title={
              <div>
                <Space size={"small"}>
                  <a>{item.name}</a>
                  <Tag color='gold' style={{fontSize:'10px'}} >{getTeamTag(item.status)}</Tag>
                </Space>
              </div>
            } description={'队伍描述：'+item.description} />
            <div className={styles.cardItemContent}>
              <span>{'队伍人数:'+item.hasJoinNum+'/'+item.maxNum}</span>
              <Space>
                <Button type="primary"  ghost  size={'small'} onClick={()=>join(item)}>加入</Button>
              </Space>
            </div>
          </Card>
          <Modal
            title="密码验证"
            open={open}
            onOk={()=>confirmSubmit()}
            onCancel={hideModal}
            okText="确认"
            cancelText="取消"
            width={300}
          >
            <label>密码：</label>
            <input type="text" value={password} onChange={handlePasswordChange}/>
          </Modal>
        </List.Item>
      )}
    />
  );

  const formItemLayout = {
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  return (
    <div className={styles.coverCardList}>
      <Card bordered={false}>
        <Form
          layout="inline"
          onValuesChange={(_, values) => {
            // 表单项变化时请求数据
            // 模拟查询表单生效
            run(values);
          }}
        >
          <StandardFormRow title="其它选项" grid last>
            <Row gutter={16}>
              <Col lg={8} md={10} sm={10} xs={24}>
                <FormItem {...formItemLayout} label="状态" name="status">
                  <Select placeholder="不限" style={{ maxWidth: 200, width: '100%' }}>
                    <Option value='0'>公开</Option>
                    <Option value='1'>私有</Option>
                    <Option value='2'>加密</Option>
                    <Option value=''>不限</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col lg={8} md={10} sm={10} xs={24}>
                <FormItem {...formItemLayout} label="最大人数" name="maxNum">
                  <Select placeholder="不限" style={{ maxWidth: 200, width: '100%' }}>
                    <Option value="1">1</Option>
                    <Option value="3">3</Option>
                    <Option value="5">5</Option>
                    <Option value="7">7</Option>
                    <Option value="">不限</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </StandardFormRow>
        </Form>
      </Card>
      <div className={styles.cardList}>{cardList}</div>
    </div>
  );
};

export default Projects;
