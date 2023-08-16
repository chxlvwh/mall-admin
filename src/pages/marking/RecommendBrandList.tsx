import { searchProps } from '@/constants/consts';
import SelectBrandModal from '@/pages/marking/components/SelectBrandModal';
import { deleteRecommendBrand, getRecommendBrandList, updateRecommendBrand } from '@/services/mall-service/api';
import { ActionType, ModalForm, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { ProFormDigit } from '@ant-design/pro-form/lib';
import { Button, Form, message, Modal, Space, Switch } from 'antd';
import { useRef, useState } from 'react';

const RecommendBrandList = () => {
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const [formRef] = Form.useForm();

    const handleRemove = (id: number) => {
        Modal.confirm({
            title: '删除',
            content: '确定删除该推荐品牌吗？',
            onOk: () => {
                deleteRecommendBrand(id).then(async () => {
                    actionRef.current?.reload();
                    await message.success('删除成功');
                });
            },
        });
    };

    const switchRecommend = (checked: boolean, record: API.RecommendBrand) => {
        // actionRef.current?.reload();
        Modal.confirm({
            title: '确认',
            content: '是否修改推荐状态？',
            onOk: async () => {
                const params = { isRecommend: checked ? 1 : 0 };
                updateRecommendBrand(record.id, params).then(async () => {
                    if (actionRef.current) actionRef.current?.reload();
                });
            },
        });
    };

    const columns: ProColumns<API.RecommendBrand>[] = [
        {
            title: '编号',
            dataIndex: 'id',
            search: false,
        },
        {
            title: '品牌名称',
            dataIndex: 'brandName',
            render: (dom: string, record: API.RecommendBrand) => {
                return <div>{record.brand.name}</div>;
            },
        },
        {
            title: '是否推荐',
            dataIndex: 'isRecommend',
            render: (dom: any, record: API.RecommendBrand) => {
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
            render: (dom: any, record: API.RecommendBrand) => {
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
                                await updateRecommendBrand(record.id, { ...record, ...values });
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
            <ProTable<API.RecommendBrand, API.PageParams & API.RecommendBrand>
                headerTitle={'优惠券列表'}
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
                        选择品牌
                    </Button>,
                ]}
                request={getRecommendBrandList}
                columns={columns}
            />
            <SelectBrandModal
                createModalOpen={createModalOpen}
                handleModalOpen={handleModalOpen}
                actionRef={actionRef}
            />
        </PageContainer>
    );
};

export default RecommendBrandList;
