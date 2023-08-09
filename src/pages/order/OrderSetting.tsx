import { getOrderSetting, updateOrderSetting } from '@/services/mall-service/api';
import { PageContainer } from '@ant-design/pro-components';
import { ProForm } from '@ant-design/pro-form';
import { ProFormDigit } from '@ant-design/pro-form/lib';
import { Form } from 'antd';
import React, { useEffect } from 'react';

const OrderSetting: React.FC = () => {
    const formRef = Form.useForm()[0];
    useEffect(() => {
        getOrderSetting().then((res) => {
            const getSetting = (key: string) => {
                return res.data?.find((item) => item.key === key)?.value;
            };
            formRef.setFieldValue('normal_order_timeout', getSetting('normal_order_timeout'));
            formRef.setFieldValue('comment_timeout', getSetting('comment_timeout'));
        });
    }, []);

    const submit = (values: any) => {
        const params = Object.keys(values).map((key) => ({ key, value: values[key] }));
        return updateOrderSetting(params).then((res) => {
            console.log(res);
        });
    };

    return (
        <PageContainer>
            <ProForm
                layout={'horizontal'}
                labelAlign={'right'}
                size={'large'}
                style={{ padding: '0 100px' }}
                form={formRef}
                onFinish={submit}
            >
                <ProForm.Group key={'key'}>
                    <ProFormDigit
                        style={{ display: 'inline-block' }}
                        label="正常订单超时"
                        name="normal_order_timeout"
                        min={1}
                        max={2880}
                        width="md"
                        initialValue={30}
                        fieldProps={{ addonAfter: '分' }}
                    />
                    <span style={{ lineHeight: '36px' }}>未付款，订单自动关闭</span>
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormDigit
                        label="订单完成超过"
                        name="comment_timeout"
                        min={1}
                        max={14}
                        width="md"
                        initialValue={7}
                        fieldProps={{ addonAfter: '天' }}
                    />
                    <span style={{ lineHeight: '36px' }}>自动五星好评</span>
                </ProForm.Group>
            </ProForm>
        </PageContainer>
    );
};

export default OrderSetting;
