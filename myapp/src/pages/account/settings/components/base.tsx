import React, {useState} from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Upload, message } from 'antd';
import ProForm, {
  ProFormDependency,
  ProFormFieldSet,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { useRequest } from 'umi';
import { queryCurrent } from '../service';
import { queryProvince, queryCity } from '../service';

import styles from './BaseView.less';
import {updateUser} from "@/services/ant-design-pro/api";

const validatorPhone = (rule: any, value: string[], callback: (message?: string) => void) => {
  if (!value[0]) {
    callback('Please input your area code!');
  }
  if (!value[1]) {
    callback('Please input your phone number!');
  }
  callback();
};
// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }: { avatar: string }) => {
  const [imagUrl,setImagUrl]= useState<string>(avatar)

  const handChange=(info : any)=>{
    if(info.file.status==='done'){
      if(info.file.response && info.file.response.code===0){
        const imagUrl = info.file.response.data;
        setImagUrl(imagUrl)
        console.log(imagUrl)
      }else{
        console.log('上传失败')
      }
      // setImagUrl(info.response.data);
      console.log('success')
    }else if(info.file.status==='error'){
      console.log('error')
    }
  }

  return (
  <>
    <div className={styles.avatar_title}>头像</div>
    <div className={styles.avatar}>
      <img src={imagUrl} alt="avatar"/>
    </div>
    <Upload
      onChange={handChange}
      showUploadList={false}
      action="/api/user/avatar/upload"
    >
      <div className={styles.button_view}>
        <Button>
          <UploadOutlined/>
          更换头像
        </Button>
      </div>
    </Upload>
  </>
)
};

const BaseView: React.FC = () => {
  const { data: currentUser, loading } = useRequest(() => {
    return queryCurrent();
  });

  const getAvatarURL = () => {
    if (currentUser) {
      if (currentUser.avatarUrl) {
        return currentUser.avatarUrl;
      }
      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;
    }
    return '';
  };


  const handleFinish = async (values) => {
    console.log(values)
    let response = await updateUser({...values,id: currentUser?.id})
    if(response?.data===true){
      message.success('更新基本信息成功');
    }else{
      message.error('更新基本信息失败');
    }
  };
  return (
    <div className={styles.baseView}>
      {loading ? null : (
        <>
          <div className={styles.left}>
            <ProForm
              layout="vertical"
              onFinish={handleFinish}
              submitter={{
                searchConfig: {
                  submitText: '更新基本信息',
                },
                render: (_, dom) => dom[1],
              }}
              initialValues={{
                ...currentUser,
                phone: currentUser?.phone,
              }}
              hideRequiredMark
            >
              <ProFormText
                width="md"
                name="email"
                label="邮箱"
                rules={[
                  {
                    required: true,
                    message: '请输入您的邮箱!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="username"
                label="昵称"
                rules={[
                  {
                    required: true,
                    message: '请输入您的昵称!',
                  },
                ]}
              />
              <ProFormTextArea
                name="profile"
                label="个人简介"
                rules={[
                  {
                    required: false,
                    message: '请输入个人简介!',
                  },
                ]}
                placeholder="个人简介"
              />
              <ProFormText
                width="md"
                name="phone"
                label="联系电话"
                rules={[
                  {
                    required: false,
                    message: '请输入您的电话号码!',
                  },
                ]}
              />

            </ProForm>
          </div>
          <div className={styles.right}>
            <AvatarView avatar={getAvatarURL()} />
          </div>
        </>
      )}
    </div>
  );
};

export default BaseView;
