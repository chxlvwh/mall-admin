import React, { useEffect, useRef, useState } from 'react';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Modal, Space, Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { FormattedMessage } from '@@/exports';
import {
    deleteCategory,
    getCategoryAncestorTree,
    getCategoryById,
    getCategoryList,
    updateCategory,
} from '@/services/mall-service/api';
import CreateCategoryModal from '@/pages/Product/components/CreateCategoryModal';
import { searchProps } from '@/utils/consts';
import { history } from '@umijs/max';
import { Route, useParams } from 'react-router';

const CategoryList: React.FC = () => {
    const [parentId, setParentId] = useState<number>();
    const [parentList, setParentList] = useState<API.Category[]>([]);
    const routerParams = useParams();
    useEffect(() => {
        setParentId(Number(routerParams.id) || undefined);
        if (routerParams.id) {
            getCategoryAncestorTree(Number(routerParams.id)).then((res) => {
                setParentList(res.data);
            });
        }
    }, [routerParams.id]);
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const [currentRow, setCurrentRow] = useState<API.Category>();
    const actionRef = useRef<ActionType>();
    const valueEnum = new Map([
        [1, '是'],
        [0, '否'],
    ]);
    const switchActive = async (isActive: boolean, detail: API.Category) => {
        Modal.confirm({
            title: '确认',
            content: isActive ? `确定激活【${detail.name}】分类吗？` : `确定冻结【${detail.name}】分类吗？`,
            onOk: async () => {
                await updateCategory(detail.id, { ...detail, parentId: detail?.parent?.id, isActive });
                if (actionRef.current) actionRef.current?.reload();
            },
        });
    };

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
            title: '排序',
            dataIndex: 'order',
            search: false,
        },
        {
            title: '分类描述',
            dataIndex: 'desc',
            search: false,
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
                return <Switch checked={record.isActive} onChange={(val) => switchActive(val, record)} />;
            },
        },
        {
            title: '设置',
            valueType: 'select',
            search: false,
            render: (_, record) => {
                return (
                    <div>
                        <Button
                            disabled={!record?.children?.length}
                            onClick={() => {
                                history.push(`/product/category/${record.id}`);
                                setParentId(record.id);
                            }}
                        >
                            查看下级
                        </Button>
                    </div>
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
                                const { data: categoryDetail } = await getCategoryById(record.id);
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
            <ProTable<API.Category, API.PageParams & Partial<API.Category>>
                cardBordered={true}
                headerTitle={
                    <div>
                        <span className={'mr-10'}>商品分类列表</span>
                        <span style={{ fontSize: '14px' }}>
                            {routerParams.id && (
                                <a
                                    href=""
                                    key={0}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        history.push(`/product/category`);
                                    }}
                                >
                                    {'全部'} &gt;{' '}
                                </a>
                            )}
                            {parentList.map((it, index) => {
                                if (index === parentList.length - 1) {
                                    return (
                                        <a
                                            href=""
                                            key={it.id}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                history.push(`/product/category/${it.id}`);
                                            }}
                                        >
                                            {it.name}
                                        </a>
                                    );
                                }
                                return (
                                    <a
                                        href=""
                                        key={it.id}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            history.push(`/product/category/${it.id}`);
                                        }}
                                    >
                                        {it.name} &gt;{' '}
                                    </a>
                                );
                            })}
                        </span>
                    </div>
                }
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
                request={getCategoryList}
                params={{ current: 1, pageSize: 10, parentId: parentId }}
                columns={columns}
                expandable={{
                    expandedRowRender: () => <div></div>,
                    rowExpandable: () => false,
                }}
            />
            <CreateCategoryModal
                createModalOpen={createModalOpen}
                handleModalOpen={handleModalOpen}
                actionRef={actionRef}
                currentRow={currentRow}
            />
        </PageContainer>
    );
};

export default CategoryList;
