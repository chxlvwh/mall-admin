import React, { useEffect, useRef, useState } from 'react';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Modal, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { FormattedMessage } from '@@/exports';
import { deleteCategory, getAttrById, getAttrList } from '@/services/mall-service/api';
import { searchProps } from '@/utils/consts';
import CreateBrandModal from '@/pages/Product/components/CreateBrandModal';
import CreateAttributeModal from '@/pages/Product/components/CreateAttributeModal';

const AttributeList: React.FC = () => {
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const [currentRow, setCurrentRow] = useState<API.Attribute>();
    const actionRef = useRef<ActionType>();

    const columns: ProColumns<API.Attribute>[] = [
        {
            title: '编号',
            dataIndex: 'id',
            search: false,
        },
        {
            title: '属性名称',
            dataIndex: 'name',
            render: (dom, record) => {
                return (
                    <a
                        onClick={async (event) => {
                            event.preventDefault();
                            const { data: attrDetail } = await getAttrById(record.id);
                            setCurrentRow(attrDetail);
                            handleModalOpen(true);
                        }}
                    >
                        {dom}
                    </a>
                );
            },
        },
        {
            title: '录入方式',
            dataIndex: 'entryMethod',
            render: (_, record) => {
                return <span>{record.entryMethod === 1 ? '手动录入' : '列表选择'}</span>;
            },
        },
        {
            title: '是否必填',
            dataIndex: 'isRequired',
            render: (_, record) => {
                return <span>{record.isRequired ? '是' : '否'}</span>;
            },
        },
        {
            title: '是否可搜索',
            dataIndex: 'canSearch',
            search: false,
            render: (_, record) => {
                return <span>{record.canSearch ? '是' : '否'}</span>;
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
                                const { data: categoryDetail } = await getAttrById(record.id);
                                setCurrentRow(categoryDetail);
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
                                    content: `确定要删除【${record.name}】分类吗？`,
                                    onOk: async () => {
                                        await deleteCategory(record.id);
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
            <ProTable<API.Attribute, API.PageParams>
                headerTitle={'商品属性列表'}
                actionRef={actionRef}
                rowKey="id"
                search={searchProps}
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
                request={getAttrList}
                columns={columns}
            />
            <CreateAttributeModal
                createModalOpen={createModalOpen}
                handleModalOpen={handleModalOpen}
                actionRef={actionRef}
                currentRow={currentRow}
            />
        </PageContainer>
    );
};

export default AttributeList;
