import { BookFilled } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { ProDescriptions } from '@ant-design/pro-components';
import { Space } from 'antd';
import React from 'react';

interface OrderDetailProps {
    orderDetail?: API.Order;
}

const OrderBaseInfo: React.FC<OrderDetailProps> = ({ orderDetail }) => {
    return (
        <ProCard
            title={
                <Space>
                    <BookFilled />
                    <span>基本信息</span>
                </Space>
            }
            type="inner"
            bordered
        >
            <ProDescriptions
                dataSource={orderDetail}
                bordered
                layout={'vertical'}
                column={4}
                columns={[
                    {
                        title: '订单编号',
                        key: 'text',
                        dataIndex: 'orderNo',
                        ellipsis: true,
                        copyable: true,
                    },
                    {
                        title: '发货单流水号',
                        key: 'deliveryNo',
                        dataIndex: 'deliveryNo',
                    },
                    {
                        title: '用户账号',
                        key: 'state2',
                        dataIndex: 'user.username',
                        render: (dom: any, record: API.Order) => {
                            return <div>{record?.user?.username}</div>;
                        },
                    },
                    {
                        title: '支付方式',
                        key: 'date',
                        dataIndex: 'paymentMethod',
                        valueEnum: new Map([
                            ['WECHAT', '微信支付'],
                            ['ALIPAY', '支付宝支付'],
                        ]),
                    },
                    {
                        title: '订单来源',
                        key: 'orderSource',
                        dataIndex: 'orderSource',
                    },
                    {
                        title: '配送方式',
                        key: 'logisticsCompany',
                        dataIndex: 'logisticsCompany',
                    },
                    {
                        title: '物流单号',
                        key: 'logisticsNo',
                        dataIndex: 'logisticsNo',
                    },
                    {
                        title: '自动确认收货时间',
                        key: 'autoReceiveTime',
                        dataIndex: 'autoReceiveTime',
                    },
                ]}
            ></ProDescriptions>
        </ProCard>
    );
};

export default OrderBaseInfo;
