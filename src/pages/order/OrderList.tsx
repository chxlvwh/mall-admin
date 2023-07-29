import { searchProps } from '@/constants/consts';
import { getOrderList } from '@/services/mall-service/api';
import { history } from '@@/core/history';
import { FormattedMessage } from '@@/exports';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Space } from 'antd';
import React, { useRef } from 'react';

const OrderList: React.FC = () => {
    const actionRef = useRef<ActionType>();

    const columns: ProColumns<API.Product>[] = [
        {
            title: '编号',
            dataIndex: 'id',
            search: false,
        },
        {
            title: '订单编号',
            dataIndex: 'orderNo',
        },
        {
            title: '提交时间（本地时间）',
            dataIndex: 'createdAt',
            search: false,
            valueType: 'dateTime',
        },
        {
            title: '用户账号',
            dataIndex: 'username',
            render: (dom: any, record: API.Order) => {
                return <div>{record.user.username}</div>;
            },
        },
        {
            title: '订单金额',
            dataIndex: 'totalPrice',
            search: false,
            render: (dom: any, record: { totalPrice: number }) => {
                return <div>{(record.totalPrice / 100).toFixed(2)}</div>;
            },
        },
        {
            title: '支付方式',
            dataIndex: 'paymentMethod',
            valueEnum: new Map([
                ['WECHAT', '微信支付'],
                ['ALIPAY', '支付宝支付'],
            ]),
        },
        {
            title: '订单来源',
            dataIndex: 'orderSource',
            valueEnum: new Map([
                ['Mobile', 'Mobile'],
                ['PC', 'PC'],
            ]),
        },
        {
            title: '订单状态',
            dataIndex: 'status',
            valueEnum: new Map([
                ['UNPAID', '待支付'],
                ['DELIVERING', '待发货'],
                ['DELIVERED', '已发货'],
                ['COMPLETED', '已完成'],
                ['CLOSED', '已关闭'],
            ]),
        },
        {
            title: '操作',
            dataIndex: 'action',
            search: false,
            render: (_: any, record: API.Order) => {
                return (
                    <Space>
                        <Button
                            type={'default'}
                            onClick={async (event) => {
                                event.preventDefault();
                                history.push(`/product/detail/${record.id}`);
                            }}
                        >
                            查看订单
                        </Button>
                    </Space>
                );
            },
        },
    ];
    return (
        <PageContainer>
            <ProTable<API.Order, API.PageParams & API.Order>
                headerTitle={'品牌列表'}
                actionRef={actionRef}
                rowKey="id"
                bordered={true}
                search={searchProps}
                toolBarRender={() => [
                    <Button
                        type="primary"
                        key="primary"
                        onClick={() => {
                            history.push('/product/detail/new');
                        }}
                    >
                        <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
                    </Button>,
                ]}
                request={getOrderList}
                columns={columns}
            />
        </PageContainer>
    );
};

export default OrderList;
