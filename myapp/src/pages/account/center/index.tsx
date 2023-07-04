import { PlusOutlined, HomeOutlined, ContactsOutlined, ClusterOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Input, Row, Tag } from 'antd';
import React, {useState, useRef, useEffect} from 'react';
import { GridContent } from '@ant-design/pro-layout';
import {  useRequest } from 'umi';
import type { RouteChildrenProps } from 'react-router';
import MyJoin from './components/MyJoin';
import type { CurrentUser,  tabKeyType } from './data.d';
import { queryCurrent } from './service';
import styles from './Center.less';
import {updateTags} from "@/services/ant-design-pro/api";
import MyCreate from "@/pages/account/center/components/MyCreate";
import {fakeUserAvatar, teamAvatar} from '@/constant/avatar';


const operationTabList = [
  // {
  //   key: 'articles',
  //   tab: (
  //     <span>
  //       文章 <span style={{ fontSize: 14 }}>(8)</span>
  //     </span>
  //   ),
  // },
  {
    key: 'myCreate',
    tab: (
      <span>
        创建的队伍 <span style={{ fontSize: 14 }}></span>
      </span>
    ),
  },
  {
    key: 'myJoin',
    tab: (
      <span>
        加入的队伍 <span style={{ fontSize: 14 }}></span>
      </span>
    ),
  },
];

const TagList: React.FC<{ tags: string[] }> = ({ tags }) => {
  const ref = useRef<Input | null>(null);
  // const [newTags, setNewTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [saveTags,setSaveTags]= useState<string[]>(tags);

  const showInput = () => {
    setInputVisible(true);
    if (ref.current) {
      // eslint-disable-next-line no-unused-expressions
      ref.current?.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue.trim() !== '') {
      const updatedTags = [...saveTags, inputValue.trim()]; // 将新标签添加到数组中
      console.log('updatedTags'+updatedTags)
      setSaveTags(updatedTags)
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleTagDelete = (tag: string) => {
    const updatedTags = (saveTags || []).filter((t) => t !== tag); // 过滤掉要删除的标签
    setSaveTags(updatedTags); // 更新临时标签数组
  };

  useEffect(()=>{
    sendTagsUpdateRequest(saveTags).then(r => console.log('tags success') )
  },[saveTags])

  const sendTagsUpdateRequest = (parsedTags: string[])=>{
    return updateTags({parsedTags})
  }


  return (
    <div className={styles.tags}>
      <div className={styles.tagsTitle}>标签</div>
      {(saveTags || []).map((item) => (
        <Tag key={item} closable onClose={()=>handleTagDelete(item)}>{item}</Tag>
      ))}
      {inputVisible && (
        <Input
          ref={ref}
          type="text"
          size="small"
          style={{ width: 78 }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag onClick={showInput} style={{ borderStyle: 'dashed' }}>
          <PlusOutlined />
        </Tag>
      )}
    </div>
  );
};

const Center: React.FC<RouteChildrenProps> = () => {
  const [tabKey, setTabKey] = useState<tabKeyType>('myCreate');
  //  获取用户信息
  const { data: currentUser, loading } = useRequest(() => {
    return queryCurrent();
  });

  //  渲染用户信息
  const renderUserInfo = ({ title, group, geographic }: Partial<CurrentUser>) => {
    return (
      <div className={styles.detail}>
        <p>
          <ContactsOutlined
            style={{
              marginRight: 8,
            }}
          />
          {title}
        </p>
        <p>
          <ClusterOutlined
            style={{
              marginRight: 8,
            }}
          />
          {group}
        </p>
        <p>
          <HomeOutlined
            style={{
              marginRight: 8,
            }}
          />
          {(geographic || { province: { label: '' } }).province.label}
          {
            (
              geographic || {
                city: {
                  label: '',
                },
              }
            ).city.label
          }
        </p>
      </div>
    );
  };

  // 渲染tab切换
  const renderChildrenByTabKey = (tabValue: tabKeyType) => {
    if (tabValue === 'myJoin') {
      return <MyJoin />;
    }
    if (tabValue === 'myCreate') {
      return <MyCreate />;
    }
    // if (tabValue === 'articles') {
    //   return <Articles />;
    // }
    return null;
  };


  return (
    <GridContent>
      <Row gutter={24}>
        <Col lg={7} md={24}>
          <Card bordered={false} style={{ marginBottom: 24 }} loading={loading}>
            {!loading && currentUser && (
              <div>
                <div className={styles.avatarHolder}>
                  <img alt="" src={currentUser.avatarUrl?currentUser.avatarUrl:fakeUserAvatar} />
                  <div className={styles.name}>{currentUser.username}</div>
                  {/*<div>{currentUser?.signature}</div>*/}
                </div>
                {/*{renderUserInfo(currentUser)}*/}
                <Divider dashed />
                <TagList tags={currentUser.parsedTags || []} />
                <Divider style={{ marginTop: 16 }} dashed />

              </div>
            )}
          </Card>
        </Col>
        <Col lg={17} md={24}>
          <Card
            className={styles.tabsCard}
            bordered={false}
            tabList={operationTabList}
            activeTabKey={tabKey}
            onTabChange={(_tabKey: string) => {
              setTabKey(_tabKey as tabKeyType);
            }}
          >
            {renderChildrenByTabKey(tabKey)}
          </Card>
        </Col>
      </Row>
    </GridContent>
  );
};
export default Center;
