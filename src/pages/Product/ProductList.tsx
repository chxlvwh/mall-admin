import {
    deleteBrand,
    getBrandList,
    getCategoryTree,
    getProductList,
    setProductOffSale,
    setProductOnSale,
} from '@/services/mall-service/api';
import { searchProps } from '@/utils/consts';
import { FormattedMessage } from '@@/exports';
import { FormOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Modal, Space, Switch } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const ProductList: React.FC = () => {
    const [categoryTree, setCategoryTree] = useState<API.Category[]>();
    const actionRef = useRef<ActionType>();

    useEffect(() => {
        getCategoryTree({ current: 1, pageSize: 100 }).then((res) => {
            setCategoryTree(res.data);
        });
    }, []);

    const switchActive = async (record: API.Product, status: boolean) => {
        if (status) {
            await setProductOnSale(record.id);
        } else {
            await setProductOffSale(record.id);
        }
        actionRef.current?.reload();
    };

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
            render: (dom: any, record: API.Product) => {
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
            render: (dom: any, record: API.Product) => {
                return (
                    <Switch
                        checked={record.status === 1}
                        checkedChildren="在售"
                        unCheckedChildren={'下架'}
                        onChange={(status) => switchActive(record, status)}
                    />
                );
            },
        },
        {
            title: '一口价',
            dataIndex: 'originPrice',
            search: false,
            render: (dom: any, record: { originPrice: number }) => {
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
            render: () => {
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
            request: async (params: { keyWords: any }) => {
                const { data } = await getBrandList({ current: 1, pageSize: 100, name: params.keyWords });
                return data.map((item) => {
                    return { label: item.name, value: item.id };
                });
            },
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
                                history.push(`/product/detail/${record.id}`);
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
                            history.push('/product/detail/new');
                        }}
                    >
                        <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
                    </Button>,
                ]}
                request={(params: API.PageParams & Partial<API.Product>) => {
                    if (params.productCategoryId && Array.isArray(params.productCategoryId)) {
                        params.productCategoryId = params.productCategoryId[params.productCategoryId.length - 1];
                    }
                    return getProductList(params);
                }}
                columns={columns}
            />
        </PageContainer>
    );
};

export default ProductList;
