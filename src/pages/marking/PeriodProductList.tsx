import SelectProductModal from '@/pages/marking/components/SelectProductModal';
import {
    addPeriodProducts,
    deletePeriodProduct,
    getPeriodProducts,
    updatePeriodProduct,
} from '@/services/mall-service/api';
import { ActionType, ModalForm, ProColumns, ProTable } from '@ant-design/pro-components';
import { ProForm } from '@ant-design/pro-form';
import { ProFormDigit, ProFormMoney } from '@ant-design/pro-form/lib';
import { Button, Form, message, Modal, Space } from 'antd';
import React, { useRef, useState } from 'react';
import { useParams } from 'react-router';

const PeriodProductList: React.FC = () => {
    const params = useParams<{ id: string; periodId: string }>();
    const editFormRef = Form.useForm()[0];
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();

    const columns: ProColumns<API.PeriodProduct>[] = [
        {
            title: '编号',
            dataIndex: 'id',
        },
        {
            title: '商品名称',
            dataIndex: 'name',
            render: (_: any, record: API.PeriodProduct) => {
                return <div>{record.product && record.product.name}</div>;
            },
        },
        {
            title: '货号',
            dataIndex: 'startTime',
            render: (_: any, record: API.PeriodProduct) => {
                return <div>{(record.product && record.product.itemNo) || '-'}</div>;
            },
        },
        {
            title: '商品价格',
            dataIndex: 'salePrice',
            render: (_: any, record: API.PeriodProduct) => {
                return <div>{record.product && record.product.salePrice / 100}</div>;
            },
        },
        {
            title: '剩余数量',
            dataIndex: 'remaining',
        },
        {
            title: '秒杀价格',
            dataIndex: 'price',
            render: (_: any, record: API.PeriodProduct) => {
                return <div>{record.price / 100}</div>;
            },
        },
        {
            title: '限购数量',
            dataIndex: 'limited',
        },
        {
            title: '排序',
            dataIndex: 'sort',
        },
        {
            title: '操作',
            dataIndex: 'action',
            render: (dom: any, record: API.PeriodProduct) => {
                return (
                    <Space>
                        <ModalForm
                            form={editFormRef}
                            width={700}
                            labelCol={{ span: 7 }}
                            wrapperCol={{ span: 13 }}
                            className={'vertical-margin-20'}
                            layout={'horizontal'}
                            title={'编辑'}
                            trigger={<Button type={'link'}>编辑</Button>}
                            // 重新打开窗口时，重置表单(验证/数据)
                            modalProps={{ destroyOnClose: true }}
                            onFinish={async (values) => {
                                console.log('[values:] ', values);
                                await updatePeriodProduct(
                                    {
                                        id: params.id as string,
                                        periodId: params.periodId as string,
                                        periodProductId: record.id,
                                    },
                                    { ...record, ...values, price: values.price * 100 },
                                );
                                actionRef.current?.reload();
                                return true;
                            }}
                        >
                            <ProForm.Item label={'商品名称'}>
                                <div>{record.product?.name}</div>
                            </ProForm.Item>
                            <ProForm.Item label={'货号'}>
                                <div>{record.product?.itemNo}</div>
                            </ProForm.Item>
                            <ProForm.Item label={'商品价格'}>
                                <div>{'¥ ' + record.product?.salePrice / 100}</div>
                            </ProForm.Item>
                            <ProFormMoney
                                initialValue={record.price / 100}
                                rules={[{ required: true }]}
                                label="秒杀价格"
                                width="md"
                                name="price"
                                min={1}
                            />
                            <ProForm.Item label={'剩余数量'}>
                                <div>{record.remaining}</div>
                            </ProForm.Item>
                            <ProFormDigit
                                initialValue={record.count}
                                rules={[{ required: true }]}
                                label="秒杀数量"
                                width="md"
                                name="count"
                                min={0.01}
                            />
                            <ProFormDigit
                                initialValue={record.limited}
                                rules={[{ required: true }]}
                                label="限购数量"
                                width="md"
                                name="limited"
                                min={1}
                            />
                            <ProFormDigit label="排序" width="md" name="sort" min={0} initialValue={record.sort || 0} />
                        </ModalForm>
                        <Button
                            type={'link'}
                            onClick={async () => {
                                Modal.confirm({
                                    title: '确定要删除当前商品吗？',
                                    onOk: async () => {
                                        await deletePeriodProduct({
                                            id: params.id as string,
                                            periodId: params.periodId as string,
                                            periodProductId: record.id,
                                        });
                                        actionRef.current?.reload();
                                        message.success('删除成功');
                                    },
                                });
                            }}
                        >
                            删除
                        </Button>
                    </Space>
                );
            },
        },
    ];
    return (
        <>
            <ProTable
                headerTitle={'秒杀商品列表'}
                bordered={true}
                pagination={false}
                actionRef={actionRef}
                rowKey={'id'}
                columns={columns}
                search={false}
                request={getPeriodProducts}
                params={{ id: Number(params.id), periodId: Number(params.periodId) }}
                toolBarRender={() => [
                    <Button
                        type="default"
                        key="primary"
                        onClick={() => {
                            handleModalOpen(true);
                        }}
                    >
                        添加商品
                    </Button>,
                ]}
            />

            <SelectProductModal
                createModalOpen={createModalOpen}
                handleModalOpen={handleModalOpen}
                actionRef={actionRef}
                createFn={(body) => addPeriodProducts(Number(params.id), Number(params.periodId), body)}
            />
        </>
    );
};

export default PeriodProductList;
