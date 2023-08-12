import { searchProps } from '@/constants/consts';
import {
    cancelOrder,
    deleteOrder,
    getLogisticList,
    getOrderList,
    orderDeliver,
    updateDeliverOrder,
    updateOrder,
} from '@/services/mall-service/api';
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
import { ProForm } from '@ant-design/pro-form';
import { ProFormSelect, ProFormText } from '@ant-design/pro-form/lib';
import { Button, Form, Modal, Space, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

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
    const [LogisticList, setLogisticList] = useState<API.Logistic[]>([]);

    useEffect(() => {
        getLogisticList().then((res) => {
            setLogisticList(res.data);
        });
    }, []);

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
                [1, '微信支付'],
                [2, '支付宝支付'],
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
                ['UNPAID', '未支付'],
                ['DELIVERING', '待发货'],
                ['DELIVERED', '已发货'],
                ['COMPLETED', '已完成'],
                ['COMMENTING', '待评价'],
                ['CLOSED', '已关闭'],
                ['REFUNDING', '退款中'],
                ['REFUNDED', '已退款'],
            ]),
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
                        {/*订单发货*/}
                        {(record.status === 'DELIVERING' || record.status === 'DELIVERED') && (
                            <ModalForm<{ logisticCompanyId: number; logisticNo: string }>
                                title={record.status === 'DELIVERING' ? '订单发货' : '修改发货信息'}
                                trigger={
                                    <Button onClick={async () => {}}>
                                        {record.status === 'DELIVERING' ? '订单发货' : '修改发货信息'}
                                    </Button>
                                }
                                // 重新打开窗口时，重置表单(验证/数据)
                                modalProps={{ destroyOnClose: true }}
                                onOpenChange={() => {
                                    remarkForm.setFieldsValue({ remark: record.remark });
                                }}
                                onFinish={async (values) => {
                                    console.log('[values:] ', values);
                                    const { logisticCompanyId, logisticNo } = values;
                                    if (!logisticCompanyId || !logisticNo) {
                                        return false;
                                    }
                                    if (record.status === 'DELIVERING') {
                                        await orderDeliver(record.orderNo, { logisticCompanyId, logisticNo });
                                        actionRef.current?.reload();
                                    } else {
                                        await updateDeliverOrder(record.orderNo, { logisticCompanyId, logisticNo });
                                        actionRef.current?.reload();
                                    }
                                    return true;
                                }}
                            >
                                <ProForm.Group>
                                    <ProFormText
                                        disabled
                                        width={'md'}
                                        label={'收货人'}
                                        name={'name'}
                                        initialValue={record.receiver.name}
                                    ></ProFormText>
                                    <ProFormText
                                        disabled
                                        width={'md'}
                                        label={'手机号'}
                                        name={'phone'}
                                        initialValue={record.receiver.phone}
                                    ></ProFormText>
                                </ProForm.Group>
                                <ProFormText
                                    disabled
                                    width={'lg'}
                                    label={'收货地址'}
                                    name={'address'}
                                    initialValue={record.receiver.address}
                                ></ProFormText>
                                <ProForm.Group>
                                    <ProFormSelect
                                        rules={[{ required: true, message: '请选择快递公司' }]}
                                        width={'md'}
                                        label={'快递公司'}
                                        name={'logisticCompanyId'}
                                        params={undefined}
                                        valueEnum={undefined}
                                        request={undefined}
                                        debounceTime={undefined}
                                        initialValue={record?.logistic?.id}
                                        options={LogisticList.map((item) => {
                                            return { label: item.name, value: item.id };
                                        })}
                                    ></ProFormSelect>
                                    <ProFormText
                                        rules={[{ required: true }]}
                                        width={'md'}
                                        label={'快递单号'}
                                        placeholder={'请输入'}
                                        name={'logisticNo'}
                                        initialValue={record?.logisticNo}
                                    ></ProFormText>
                                </ProForm.Group>
                            </ModalForm>
                        )}
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
                request={async (params: Partial<API.Order>) => {
                    return await getOrderList({ ...params, withLogistic: true });
                }}
                columns={columns}
            />
        </PageContainer>
    );
};

export default OrderList;
