import { Card, message } from 'antd';
import ProForm, {
  ProFormDatePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { useRequest } from 'umi';
import type { FC } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {createTeam} from "@/services/ant-design-pro/api";
import {useState} from "react";

const BasicForm: FC<Record<string, any>> = () => {
  const [code,setCode]=useState<number>()
  const [resDescri,setResDescri]=useState('创建失败')
  const { run } = useRequest(async (values) => {
    const response = await createTeam({...values})
    setCode(response.code)
    setResDescri(response.description)
    return response
  }, {
    manual: true,
    onSuccess: () => {
      console.log('code',code)
      if(code===0) {
        message.success('创建成功');
      }
      else message.error(resDescri)
    },
  });

  const onFinish = async (values: Record<string, any>) => {
    console.log(values)
    run(values);
  };

  return (
    <PageContainer content="创建属于自己的队伍。">
      <Card bordered={false}>
        <ProForm
          hideRequiredMark
          style={{ margin: 'auto', marginTop: 8, maxWidth: 600 }}
          name="basic"
          layout="vertical"
          initialValues={{ public: '1' }}
          onFinish={onFinish}
        >
          <ProFormText
            width="md"
            label="队伍名"
            name="name"
            rules={[
              {
                required: true,
                message: '请输入队伍名',
              },
            ]}
            placeholder="给队伍起个名字"
          />
          <ProFormDatePicker
            label="过期时间"
            width="md"
            name="expireTime"
            rules={[
              {
                required: true,
                message: '请选择过期日期',
              },
            ]}
            placeholder={['选择过期日期']}
          />
          <ProFormTextArea
            label="队伍描述"
            width="xl"
            name="description"
            placeholder="请输入队伍描述"
          />


          <ProFormDigit
            label={
              <span>
                最大人数
              </span>
            }
            name="maxNum"
            placeholder="请输入"
            min={1}
            max={20}
            width="xs"
            fieldProps={{
              formatter: (value) => `${value || 1}`,
              parser: (value) => (value ? value : '1'),
            }}
            rules={[
              {
                required: true,
                message: '输入最大人数',
              }
            ]}
          />

          <ProFormRadio.Group
            options={[
              {
                value: '0',
                label: '公开',
              },
              {
                value: '1',
                label: '私密',
              },
              {
                value: '2',
                label: '加密',
              },
            ]}
            label="队伍状态"
            name="status"
            rules={[
              {
                required: true,
                message: '请选择队伍状态',
              },
            ]}
          />
          <ProFormDependency name={['status']}>
            {({ status }) => {
              if ( status === '2') {
                return (
                  <ProFormText.Password
                    label="密码"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: '请输入密码',
                      },
                    ]}
                    width="sm"
                  />
                );
              }

              return null;
            }}
          </ProFormDependency>
        </ProForm>
      </Card>
    </PageContainer>
  );
};

export default BasicForm;
