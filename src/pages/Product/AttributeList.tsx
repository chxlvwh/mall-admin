import CreateAttributeModal from '@/pages/Product/components/CreateAttributeModal';
import { deleteAttr, getAttrById, getAttrList } from '@/services/mall-service/api';
import { searchProps } from '@/utils/consts';
import { FormattedMessage } from '@@/exports';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Modal, Space, Tag } from 'antd';
import React, { useRef, useState } from 'react';

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
            render: (
                dom:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                    | React.ReactFragment
                    | React.ReactPortal
                    | null
                    | undefined,
                record: { id: number },
            ) => {
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
            title: '属性类型',
            dataIndex: 'type',
            valueEnum: new Map([
                [1, '基本属性'],
                [2, '其他属性'],
            ]),
            render: (_: any, record: { type: number }) => {
                return (
                    <span>
                        {record.type === 1 ? <Tag color="blue">基本属性</Tag> : <Tag color="green">其他属性</Tag>}
                    </span>
                );
            },
        },
        {
            title: '可选属性值',
            dataIndex: 'value',
            search: false,
        },
        {
            title: '录入方式',
            dataIndex: 'entryMethod',
            valueEnum: new Map([
                [1, '手动录入'],
                [2, '列表选择'],
            ]),
            render: (_: any, record: { entryMethod: number }) => {
                return (
                    <span>
                        {record.entryMethod === 1 ? (
                            <Tag color="green">手动录入</Tag>
                        ) : (
                            <Tag color="blue">列表选择</Tag>
                        )}
                    </span>
                );
            },
        },
        {
            title: '是否必填',
            dataIndex: 'isRequired',
            valueEnum: new Map([
                [1, '是'],
                [0, '否'],
            ]),
            render: (_: any, record: { isRequired: any }) => {
                return <span>{record.isRequired ? <Tag color="red">是</Tag> : <Tag color="blue">否</Tag>}</span>;
            },
        },
        {
            title: '是否可搜索',
            dataIndex: 'canSearch',
            valueEnum: new Map([
                [1, '是'],
                [0, '否'],
            ]),
            render: (_: any, record: { canSearch: any }) => {
                return <span>{record.canSearch ? <Tag color="red">是</Tag> : <Tag color="blue">否</Tag>}</span>;
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
            render: (_: any, record: { id: number; name: any }) => {
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
                                        await deleteAttr(record.id);
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
