import React, { useEffect, useRef, useState } from 'react';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import {
    deleteBrand,
    getBrandList,
    getCategoryTree,
    getProductById,
    getProductList,
} from '@/services/mall-service/api';
import { Button, Modal, Space, Switch } from 'antd';
import { searchProps } from '@/utils/consts';
import { FormOutlined, PlusOutlined } from '@ant-design/icons';
import { FormattedMessage } from '@@/exports';
import CreateProductModal from '@/pages/Product/components/CreateProductModal';

const ProductList: React.FC = () => {
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const [currentRow, setCurrentRow] = useState<API.Product>();
    const [categoryTree, setCategoryTree] = useState<API.Category[]>();
    const actionRef = useRef<ActionType>();

    useEffect(() => {
        getCategoryTree({ current: 1, pageSize: 1 }).then((res) => {
            setCategoryTree(res.data);
        });
    }, []);

    const switchActive = async (val: boolean, record: API.Product) => {};

    const columns: ProColumns<API.Product>[] = [
        {
            title: '编号',
            dataIndex: 'id',
            search: false,
        },
        {
            title: '商品图片',
            dataIndex: 'icon',
            search: false,
        },
        {
            title: '商品名称',
            dataIndex: 'name',
            render: (dom, record) => {
                return (
                    <div className={'text-center'}>
                        <div>{record.name}</div>
                        <br />
                        <div>品牌：{record.brand.name}</div>
                    </div>
                );
            },
        },
        {
            title: '货号',
            dataIndex: 'itemNo',
        },
        {
            title: '上架状态',
            dataIndex: 'status',
            valueEnum: new Map([
                ['1', '在售'],
                ['0', '下架'],
            ]),
            render: (dom, record) => {
                return (
                    <Switch
                        checked={record.status === 1}
                        checkedChildren="在售"
                        unCheckedChildren={'下架'}
                        onChange={(val) => switchActive(val, record)}
                    />
                );
            },
        },
        {
            title: '一口价',
            dataIndex: 'originPrice',
            search: false,
            render: (dom, record) => {
                return <div className={'text-center'}>{(record.originPrice / 100).toFixed(2)}</div>;
            },
        },
        {
            title: '库存',
            dataIndex: 'stock',
            search: false,
        },
        {
            title: '单位',
            dataIndex: 'unit',
            search: false,
        },
        {
            title: 'Sku',
            dataIndex: 'skus',
            search: false,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render: (_, record) => {
                return (
                    <div
                        className={'pointer text-center'}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: '#1890ff',
                            lineHeight: '40px',
                        }}
                    >
                        <FormOutlined style={{ color: 'white' }} />
                    </div>
                );
            },
        },
        {
            title: '商品描述',
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
            title: '商品分类',
            valueType: 'cascader',
            dataIndex: 'productCategoryId',
            hideInTable: true,
            fieldProps: {
                options: categoryTree,
                fieldNames: { label: 'name', value: 'id' },
                showSearch: true,
            },
        },
        {
            title: '商品品牌',
            valueType: 'select',
            dataIndex: 'brandId',
            hideInTable: true,
            fieldProps: {
                showSearch: true,
            },
            debounceTime: 800,
            request: async (params) => {
                const { data } = await getBrandList({ current: 1, pageSize: 1, name: params.keyWords });
                return data.map((item) => {
                    return { label: item.name, value: item.id };
                });
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
                                const { data: detail } = await getProductById(record.id);
                                setCurrentRow(detail);
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
            <ProTable<API.Product, API.PageParams & API.Product>
                headerTitle={'品牌列表'}
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
                request={(params) => {
                    if (params.productCategoryId && Array.isArray(params.productCategoryId)) {
                        params.productCategoryId = params.productCategoryId[params.productCategoryId.length - 1];
                    }
                    return getProductList(params);
                }}
                columns={columns}
            />
            <CreateProductModal
                createModalOpen={createModalOpen}
                handleModalOpen={handleModalOpen}
                actionRef={actionRef}
                currentRow={currentRow}
            />
        </PageContainer>
    );
};

export default ProductList;
