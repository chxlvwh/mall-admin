import { BookFilled } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Space } from 'antd';
import React, { useMemo } from 'react';

interface OrderDetailProps {
    orderDetail?: API.Order;
    products?: API.Product[];
    items?: API.OrderItem[];
}

const OrderBaseInfo: React.FC<OrderDetailProps> = ({ items }) => {
    const totalProductPrice = useMemo(() => {
        return (
            items?.reduce((pre, cur) => {
                return pre + (cur.sku ? cur.sku.price : cur.product.salePrice) * cur.quantity;
            }, 0) || 0
        );
    }, [items]);

    const columns: ProColumns<API.OrderItem>[] = [
        {
            title: '商品图片',
            dataIndex: 'icon',
            render: (dom: any, record: API.OrderItem) => {
                return (
                    <div style={{ padding: '20px' }}>
                        <img
                            src={record.product?.coverUrls?.[0]}
                            alt={record.product?.name}
                            style={{ width: '100px', height: 'auto', borderRadius: '5px' }}
                        />
                    </div>
                );
            },
        },
        {
            title: '商品名称',
            dataIndex: 'name',
            render: (dom: any, record: API.OrderItem) => {
                return (
                    <div>
                        <div>{record.product?.name}</div>
                        <br />
                        <div>品牌：{record.product?.brand?.name}</div>
                    </div>
                );
            },
        },
        {
            title: '商品原价',
            dataIndex: 'name',
            search: false,
            render: (dom: any, record: API.OrderItem) => {
                return <div>¥{(record.sku ? record.sku.price : record.product.salePrice) / 100}</div>;
            },
        },
        {
            title: '优惠券优惠',
            dataIndex: 'name',
            search: false,
            render: (dom: any, record: API.OrderItem) => {
                if (record.coupon && record.coupon[0]) {
                    return <div>-¥{record.coupon[0].value / 100}</div>;
                } else {
                    return <div>-</div>;
                }
            },
        },
        {
            title: '成交价',
            dataIndex: 'name',
            search: false,
            render: (dom: any, record: API.OrderItem) => {
                return <div>¥{record.discountedPrice / 100}</div>;
            },
        },
        {
            title: '数量',
            dataIndex: 'quantity',
            search: false,
        },
        {
            title: '小计',
            dataIndex: 'total',
            search: false,
            render: (dom: any, record: API.OrderItem) => {
                return <div>¥{(record.discountedPrice / 100) * record.quantity}</div>;
            },
        },
    ];

    return (
        <>
            <ProCard
                title={
                    <Space>
                        <BookFilled />
                        <span>商品信息</span>
                    </Space>
                }
                type="inner"
                bordered
            >
                <ProTable
                    columns={columns}
                    dataSource={items}
                    search={false}
                    options={false}
                    bordered={true}
                    pagination={false}
                ></ProTable>
                <h3 className={'text-right padding-horizontal-24'}>
                    <span>合计：</span>
                    <span className={'danger-color'}>¥{totalProductPrice / 100}</span>
                </h3>
            </ProCard>
        </>
    );
};

export default OrderBaseInfo;
