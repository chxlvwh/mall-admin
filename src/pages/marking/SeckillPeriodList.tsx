import { deleteSeckillPeriod, getSeckillById, updateSeckillPeriod } from '@/services/mall-service/api';
import { ModalForm, ProColumns, ProFormRadio, ProTable } from '@ant-design/pro-components';
import { ProFormText } from '@ant-design/pro-form/lib';
import { Button, Form, message, Modal, Space, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const SeckillPeriodList: React.FC = () => {
    const params = useParams<{ id: string }>();
    const [dataSource, setDataSource] = useState<API.SeckillPeriod[]>();
    const editFormRef = Form.useForm()[0];

    const getList = () => {
        if (Number(params.id) || Number(params.id) === 0) {
            getSeckillById(Number(params.id)).then((res) => {
                if (res.data) {
                    setDataSource(res.data.seckillPeriods || []);
                }
            });
        }
    };

    useEffect(() => {
        getList();
    }, []);

    const switchEnable = (value: boolean, record: API.SeckillPeriod) => {
        Modal.confirm({
            title: `确定要${value ? '【开启】' : '【关闭】'}启用吗？`,
            onOk: async () => {
                await updateSeckillPeriod(Number(params.id), record.id, { ...record, enable: value });
                getList();
                message.success(`${value ? '开启' : '关闭'}成功`);
            },
        });
    };

    const columns: ProColumns<API.SeckillPeriod>[] = [
        {
            title: '编号',
            dataIndex: 'id',
        },
        {
            title: '秒杀时间段名称',
            dataIndex: 'name',
        },
        {
            title: '每日开始时间',
            dataIndex: 'startTime',
        },
        {
            title: '每日结束时间',
            dataIndex: 'endTime',
        },
        {
            title: '商品数量',
            dataIndex: 'index',
        },
        {
            title: '启用',
            dataIndex: 'enable',
            render: (dom: any, record: API.SeckillPeriod) => {
                return <Switch onChange={(checked) => switchEnable(checked, record)} checked={record.enable} />;
            },
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
                                getList();
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
                                    title: '确定要删除当前时间段吗？',
                                    onOk: async () => {
                                        await deleteSeckillPeriod(Number(params.id), record.id);
                                        message.success('删除成功');
                                        getList();
                                    },
                                });
                            }}
                        >
                            删除
                        </Button>
                        <Button type={'link'}>添加商品</Button>
                    </Space>
                );
            },
        },
    ];

    return (
        <ProTable
            bordered={true}
            pagination={false}
            rowKey={'id'}
            columns={columns}
            search={false}
            dataSource={dataSource}
        />
    );
};

export default SeckillPeriodList;
