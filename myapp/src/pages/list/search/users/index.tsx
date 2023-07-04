import {Avatar, Card, Col, Form, List, Row, Select, Switch, Tag, Tooltip} from 'antd';
import type { FC } from 'react';
import {useLocation, useRequest} from 'umi';
import StandardFormRow from './components/StandardFormRow';
import TagSelect from './components/TagSelect';
import styles from './style.less';
import {matchUsers, queryUser} from "@/services/ant-design-pro/api";
import {API} from "@/services/ant-design-pro/typings";
import {fakeUserAvatar} from "@/constant/avatar";
// import React from "react";

import {
  MessageOutlined,
  UserAddOutlined, UserDeleteOutlined
} from "@ant-design/icons";
import {useEffect} from "react";


const { Option } = Select;
const FormItem = Form.Item;



const Projects: FC = () => {
  const location = useLocation();
  const{searchText}=location?.query;
  const {data:data, loading, run } = useRequest((values: any) => {
    console.log('form data', values);
    // return queryFakeList({
    //   count: 8,
    // });
    if(values && values.match===true){
      return matchUsers();
    }
    else return queryUser({...values,'searchText':searchText})
  });
  //
  useEffect((values)=>{
    run(values)
  },[searchText])

  const list = data || [];

  const MAX_LABEL_COUNT = 2; // 最大标签数量

  const renderLabels = (labels: string[]) => {
    if (labels.length <= MAX_LABEL_COUNT) {
      return labels.map((label) => (
        <Tag key={label} color='blue'>{label}</Tag>
      ));
    }

    const truncatedLabels = labels.slice(0, MAX_LABEL_COUNT);
    const remainingLables = labels.slice(MAX_LABEL_COUNT);

    return (
      <>
        {truncatedLabels.map((label) => (
          <Tag key={label} color='blue'>{label}</Tag>
        ))}
        <Tooltip title={remainingLables.join(',')} placement="bottom">
          <Tag color='blue'>{'...'}</Tag>
        </Tooltip>
      </>
    );
  };

  const cardList = list && (
    <List<API.CurrentUser>
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
      renderItem={(item) => {
        const tags: string[] = item.tags ? JSON.parse(item.tags) : []

        return (
          <List.Item key={item.id}>
            <Card
              hoverable
              style={{width:250,height: 175}}
              bodyStyle={{ paddingBottom: 30}}
              actions={[
                <div style={{flex:1}}>
                  {true && <Tooltip key="addUser" title="添加好友" >
                    <UserAddOutlined />
                  </Tooltip>}
                  {false && <Tooltip key="deleteUser" title="删除好友">
                    <UserDeleteOutlined />
                  </Tooltip>}
                </div>,
                <Tooltip title="发送信息" key="sendMessage">
                  <MessageOutlined />
                </Tooltip>,
              ]}
            >
              <Card.Meta avatar={<Avatar size={64} src={item.avatarUrl?item.avatarUrl:fakeUserAvatar} />} title={item.username}
                         description={renderLabels(tags)}/>
            </Card>
          </List.Item>)
      }}
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
          <StandardFormRow title="学校" block style={{ paddingBottom: 11 }}>
            <FormItem name="tagsName">
              <TagSelect expandable>
                <TagSelect.Option value="广工">广东工业大学</TagSelect.Option>
                <TagSelect.Option value="清华">清华大学</TagSelect.Option>
                <TagSelect.Option value="中大">中山大学</TagSelect.Option>
                <TagSelect.Option value="深大">深圳大学</TagSelect.Option>
              </TagSelect>
            </FormItem>
          </StandardFormRow>
          <StandardFormRow title="专业" block style={{ paddingBottom: 11 }}>
            <FormItem name="tagsName">
              <TagSelect expandable>
                <TagSelect.Option value="软工">软件工程</TagSelect.Option>
                <TagSelect.Option value="网工">网络工程</TagSelect.Option>
                <TagSelect.Option value="自动化">自动化</TagSelect.Option>
                <TagSelect.Option value="信安">信息安全</TagSelect.Option>
              </TagSelect>
            </FormItem>
          </StandardFormRow>
          <StandardFormRow title="城市" block style={{ paddingBottom: 11 }}>
            <FormItem name="tagsName">
              <TagSelect expandable>
                <TagSelect.Option value="北京">北京</TagSelect.Option>
                <TagSelect.Option value="上海">上海</TagSelect.Option>
                <TagSelect.Option value="广州">广州</TagSelect.Option>
                <TagSelect.Option value="杭州">杭州</TagSelect.Option>
                <TagSelect.Option value="广西">广西</TagSelect.Option>
              </TagSelect>
            </FormItem>
          </StandardFormRow>

          <StandardFormRow title="其它选项" grid >
            <Row gutter={16}>
              <Col lg={8} md={10} sm={10} xs={24}>
                <FormItem {...formItemLayout} label="性别" name="gender">
                  <Select placeholder="不限" style={{ maxWidth: 200, width: '100%' }}>
                    <Option value='0'>女</Option>
                    <Option value='1'>男</Option>
                    <Option value=''>不限</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </StandardFormRow>
          <StandardFormRow title="匹配模式" grid last>
            <Row gutter={16}>
              <Col lg={8} md={10} sm={10} xs={24}>
                <FormItem {...formItemLayout}  name="match">
                  <Switch defaultChecked={false} />
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
