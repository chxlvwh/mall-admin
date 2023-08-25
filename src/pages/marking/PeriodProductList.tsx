import SelectProductModal from '@/pages/marking/components/SelectProductModal';
import {
    addPeriodProducts,
    deletePeriodProducts,
    getPeriodProducts,
    updateSeckillPeriod,
} from '@/services/mall-service/api';
import { ActionType, ModalForm, ProColumns, ProFormRadio, ProTable } from '@ant-design/pro-components';
import { ProFormText } from '@ant-design/pro-form/lib';
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
            render: (dom: any, record: API.SeckillPeriod) => {
                return (
                    <Space>
                        <ModalForm
                            form={editFormRef}
                            width={500}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 12 }}
                            className={'vertical-margin-20'}
                            layout={'horizontal'}
                            title={'编辑'}
                            trigger={<Button type={'link'}>编辑</Button>}
                            // 重新打开窗口时，重置表单(验证/数据)
                            modalProps={{ destroyOnClose: true }}
                            onFinish={async (values) => {
                                await updateSeckillPeriod(Number(params.id), record.id, { ...record, ...values });
                                return true;
                            }}
                        >
                            <ProFormText
                                label={'秒杀时间段名称'}
                                initialValue={record.name}
                                name={'name'}
                                width={'md'}
                                rules={[{ required: true }]}
                            />
                            <ProFormText
                                label={'每日开始时间'}
                                initialValue={record.startTime}
                                name={'startTime'}
                                width={'md'}
                                rules={[{ required: true }]}
                            />
                            <ProFormText
                                label={'每日结束时间'}
                                initialValue={record.endTime}
                                name={'endTime'}
                                width={'md'}
                                rules={[{ required: true }]}
                            />
                            <ProFormRadio.Group
                                initialValue={record.enable || false}
                                radioType={'button'}
                                label="是否启用"
                                width="md"
                                name="enable"
                                options={[
                                    {
                                        label: '上线',
                                        value: true,
                                    },
                                    {
                                        label: '下线',
                                        value: false,
                                    },
                                ]}
                                params={undefined}
                                debounceTime={undefined}
                                request={undefined}
                                valueEnum={undefined}
                            ></ProFormRadio.Group>
                        </ModalForm>
                        <Button
                            type={'link'}
                            onClick={async () => {
                                Modal.confirm({
                                    title: '确定要删除当前商品吗？',
                                    onOk: async () => {
                                        await deletePeriodProducts({
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
