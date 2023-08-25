import { searchProps } from '@/constants/consts';
import SelectProductModal from '@/pages/marking/components/SelectProductModal';
import {
    addRecommendNew,
    deleteRecommendNew,
    getRecommendNewList,
    updateRecommendNew,
} from '@/services/mall-service/api';
import { ActionType, ModalForm, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { ProFormDigit } from '@ant-design/pro-form/lib';
import { Button, Form, message, Modal, Space, Switch } from 'antd';
import React, { useRef, useState } from 'react';

const RecommendNewList: React.FC = () => {
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const [formRef] = Form.useForm();

    const handleRemove = (id: number) => {
        Modal.confirm({
            title: '删除',
            content: '确定删除该推荐商品吗？',
            onOk: () => {
                deleteRecommendNew(id).then(async () => {
                    actionRef.current?.reload();
                    await message.success('删除成功');
                });
            },
        });
    };

    const switchRecommend = (checked: boolean, record: API.RecommendNew) => {
        // actionRef.current?.reload();
        Modal.confirm({
            title: '确认',
            content: '是否修改推荐状态？',
            onOk: async () => {
                const params = { isRecommend: checked ? 1 : 0 };
                updateRecommendNew(record.id, params).then(async () => {
                    if (actionRef.current) actionRef.current?.reload();
                });
            },
        });
    };

    const columns: ProColumns<API.RecommendNew>[] = [
        {
            title: '编号',
            dataIndex: 'id',
            search: false,
        },
        {
            title: '商品名称',
            dataIndex: 'productName',
            render: (dom: string, record: API.RecommendNew) => {
                return <div>{record.product.name}</div>;
            },
        },
        {
            title: '是否推荐',
            dataIndex: 'isRecommend',
            render: (dom: any, record: API.RecommendNew) => {
                return (
                    <Switch onChange={(checked) => switchRecommend(checked, record)} checked={!!record.isRecommend} />
                );
            },
            valueEnum: new Map([
                [1, '是'],
                [0, '否'],
            ]),
        },
        {
            title: '排序',
            dataIndex: 'sort',
            search: false,
        },
        {
            title: '操作',
            dataIndex: 'action',
            search: false,
            render: (dom: any, record: API.RecommendNew) => {
                return (
                    <Space>
                        <ModalForm
                            form={formRef}
                            width={500}
                            className={'vertical-margin-20'}
                            layout={'horizontal'}
                            title={'设置排序'}
                            trigger={<Button onClick={async () => {}}>设置排序</Button>}
                            // 重新打开窗口时，重置表单(验证/数据)
                            modalProps={{ destroyOnClose: true }}
                            onOpenChange={() => {
                                formRef.setFieldValue('sort', record.sort);
                            }}
                            onFinish={async (values) => {
                                await updateRecommendNew(record.id, { ...record, ...values });
                                if (actionRef.current) actionRef.current?.reload();
                                return true;
                            }}
                        >
                            <ProFormDigit width={'md'} name={'sort'} label={'排序'} />
                        </ModalForm>
                        <Button danger onClick={() => handleRemove(record.id)}>
                            删除
                        </Button>
                    </Space>
                );
            },
        },
    ];
    return (
        <PageContainer>
            <ProTable<API.RecommendNew, API.PageParams & API.RecommendNew>
                headerTitle={'数据列表'}
                actionRef={actionRef}
                rowKey="id"
                search={searchProps}
                toolBarRender={() => [
                    <Button
                        type="primary"
                        key="primary"
                        onClick={() => {
                            handleModalOpen(true);
                        }}
                    >
                        选择商品
                    </Button>,
                ]}
                request={getRecommendNewList}
                columns={columns}
            />
            <SelectProductModal
                createModalOpen={createModalOpen}
                handleModalOpen={handleModalOpen}
                actionRef={actionRef}
                createFn={addRecommendNew}
            />
        </PageContainer>
    );
};

export default RecommendNewList;
