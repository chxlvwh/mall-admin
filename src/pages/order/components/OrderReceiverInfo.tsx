import { BookFilled } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { ProDescriptions } from '@ant-design/pro-components';
import { Space } from 'antd';
import React from 'react';

interface OrderDetailProps {
    receiver?: API.Receiver;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ receiver }) => {
    return (
        <>
            <ProCard
                title={
                    <Space>
                        <BookFilled />
                        <span>收货人信息</span>
                    </Space>
                }
                type="inner"
                bordered
            >
                <ProDescriptions
                    dataSource={receiver}
                    bordered
                    layout={'vertical'}
                    column={4}
                    columns={[
                        {
                            title: '收货人',
                            key: 'name',
                            dataIndex: 'name',
                        },
                        {
                            title: '电话',
                            key: 'phone',
                            dataIndex: 'phone',
                            copyable: true,
                        },
                        {
                            title: '邮政编码',
                            key: 'zip',
                            dataIndex: 'zip',
                        },
                        {
                            title: '收货地址',
                            key: 'address',
                            dataIndex: 'address',
                        },
                    ]}
                ></ProDescriptions>
            </ProCard>
        </>
    );
};

export default OrderDetail;
