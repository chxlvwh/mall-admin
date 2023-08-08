import { searchProps } from '@/constants/consts';
import { cancelOrder, deleteOrder, getOrderList, updateOrder } from '@/services/mall-service/api';
import { history } from '@@/core/history';
import { EditTwoTone } from '@ant-design/icons';
import {
    ActionType,
    ModalForm,
    PageContainer,
    ProColumns,
    ProFormTextArea,
    ProTable,
} from '@ant-design/pro-components';
import { Button, Form, Modal, Space, Tag } from 'antd';
import React, { useRef } from 'react';

export enum OrderStatus {
    UNPAID = '未支付',
    DELIVERING = '待发货',
    DELIVERED = '已发货',
    COMPLETED = '已完成',
    COMMENTING = '待评价',
    CLOSED = '已关闭',
    REFUNDING = '退款中',
    REFUNDED = '已退款',
}

const OrderList: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const [remarkForm] = Form.useForm();

    const columns: ProColumns<API.Product>[] = [
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
            render: (dom: any, record: API.Order) => {
                switch (record.status) {
                    case 'UNPAID':
                        return <Tag color={'warning'}>{OrderStatus[record.status]}</Tag>;
                    case 'DELIVERING':
                        return <Tag color={'lime'}>{OrderStatus[record.status]}</Tag>;
                    case 'DELIVERED':
                        return <Tag color={'blue'}>{OrderStatus[record.status]}</Tag>;
                    case 'COMPLETED':
                        return <Tag color={'green'}>{OrderStatus[record.status]}</Tag>;
                    case 'COMMENTING':
                        return <Tag color={'purple'}>{OrderStatus[record.status]}</Tag>;
                    case 'CLOSED':
                        return <Tag>{OrderStatus[record.status]}</Tag>;
                    case 'REFUNDING':
                        return <Tag color={'magenta'}>{OrderStatus[record.status]}</Tag>;
                    case 'REFUNDED':
                        return <Tag>{OrderStatus[record.status]}</Tag>;
                }
            },
        },
        {
            title: '备注',
            dataIndex: 'remark',
            search: false,
            render: (dom: any, record: API.Order) => {
                return (
                    <Space>
                        {record.remark || '-'}
                        <ModalForm<{ remark: string }>
                            form={remarkForm}
                            title="更新备注"
                            layout={'horizontal'}
                            width={400}
                            trigger={<EditTwoTone className={'pointer'} />}
                            onOpenChange={() => {
                                remarkForm.setFieldsValue({ remark: record.remark });
                            }}
                            onFinish={async (values) => {
                                await updateOrder(record.orderNo, { remark: values.remark });
                                actionRef.current?.reload();
                                return true;
                            }}
                        >
                            <ProFormTextArea width="md" name="remark" label="备注" placeholder="请输入" />
                        </ModalForm>
                    </Space>
                );
            },
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
                                history.push(`/order/detail/${record.orderNo}`);
                            }}
                        >
                            查看订单
                        </Button>
                        {/*取消订单*/}
                        {record.status === 'UNPAID' && (
                            <Button
                                danger
                                onClick={async () => {
                                    Modal.confirm({
                                        title: '确认取消订单？',
                                        content: '取消订单后，订单将无法恢复',
                                        onOk: async () => {
                                            cancelOrder(record.orderNo).then(() => {
                                                actionRef.current?.reload();
                                            });
                                        },
                                    });
                                }}
                            >
                                取消订单
                            </Button>
                        )}
                        {/*删除订单*/}
                        {(record.status === 'CLOSED' ||
                            record.status === 'COMPLETED' ||
                            record.status === 'REFUNDED') && (
                            <Button
                                type={'primary'}
                                danger
                                onClick={async () => {
                                    Modal.confirm({
                                        title: '确认删除订单？',
                                        content: '删除订单后，订单将无法恢复',
                                        onOk: async () => {
                                            deleteOrder(record.orderNo).then(() => {
                                                actionRef.current?.reload();
                                            });
                                        },
                                    });
                                }}
                            >
                                删除订单
                            </Button>
                        )}
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
                rowKey="orderNo"
                bordered={true}
                search={searchProps}
                request={getOrderList}
                columns={columns}
            />
        </PageContainer>
    );
};

export default OrderList;
