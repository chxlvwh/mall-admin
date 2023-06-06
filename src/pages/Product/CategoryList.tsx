import React, { useRef, useState } from 'react';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Modal, Space, Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { FormattedMessage } from '@@/exports';
import { deleteBrand, getBrandById, getBrandList, getCategoryList } from '@/services/mall-service/api';
import CreateBrandModal from '@/pages/Product/components/CreateBrandModal';

const CategoryList: React.FC = () => {
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const [currentRow, setCurrentRow] = useState<API.Category>();
    const actionRef = useRef<ActionType>();
    const valueEnum = new Map([
        [1, '是'],
        [0, '否'],
    ]);

    const columns: ProColumns<API.Category>[] = [
        {
            title: '编号',
            dataIndex: 'id',
            search: false,
        },
        {
            title: '分类名称',
            dataIndex: 'name',
            render: (dom, entity) => {
                return (
                    <a
                        onClick={() => {
                            setCurrentRow(entity);
                        }}
                    >
                        {dom}
                    </a>
                );
            },
        },
        {
            title: '添加时间',
            valueType: 'dateTime',
            dataIndex: 'createdAt',
            search: false,
        },
        {
            title: '最后修改时间',
            valueType: 'dateTime',
            dataIndex: 'lastModifiedAt',
            search: false,
        },
        {
            title: '是否激活',
            dataIndex: 'isActive',
            valueType: 'select',
            valueEnum,
            render: (_, record) => {
                return (
                    <Switch
                        checked={record.isActive}
                        // onChange={(val) => switchOpen(val, record.id)}
                    />
                );
            },
        },
        {
            title: '操作',
            dataIndex: 'action',
            search: false,
            render: (_, record) => {
                return (
                    <Space>
                        <Button
                            type={'primary'}
                            onClick={async (event) => {
                                event.preventDefault();
                                const { data: brandDetail } = await getBrandById(record.id);
                                setCurrentRow(brandDetail);
                                handleModalOpen(true);
                            }}
                        >
                            编辑
                        </Button>
                        <Button
                            type={'primary'}
                            danger
                            onClick={async (event) => {
                                event.preventDefault();
                                Modal.confirm({
                                    title: '确认',
                                    content: `确定要删除${record.name}品牌吗？`,
                                    onOk: () => {
                                        deleteBrand(record.id);
                                        if (actionRef.current) {
                                            actionRef.current.reload();
                                        }
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
        <PageContainer>
            <ProTable<API.Category, API.PageParams>
                headerTitle={'用户列表'}
                actionRef={actionRef}
                rowKey="id"
                search={{
                    showHiddenNum: true,
                    span: {
                        xs: 24,
                        sm: 24,
                        md: 12,
                        lg: 12,
                        xl: 8,
                        xxl: 6,
                    },
                }}
                toolBarRender={() => [
                    <Button
                        type="primary"
                        key="primary"
                        onClick={() => {
                            setCurrentRow(undefined);
                            handleModalOpen(true);
                        }}
                    >
                        <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
                    </Button>,
                ]}
                request={getCategoryList}
                columns={columns}
            />
            <CreateBrandModal
                createModalOpen={createModalOpen}
                handleModalOpen={handleModalOpen}
                actionRef={actionRef}
                currentRow={currentRow}
            />
        </PageContainer>
    );
};

export default CategoryList;
