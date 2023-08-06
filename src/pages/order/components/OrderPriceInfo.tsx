import { BookFilled } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { ProColumns, ProDescriptions } from '@ant-design/pro-components';
import { Space } from 'antd';
import React, { useMemo } from 'react';

interface OrderDetailProps {
    orderDetail?: API.Order;
}

const OrderBaseInfo: React.FC<OrderDetailProps> = ({ orderDetail }) => {
    const totalProductPrice = useMemo(() => {
        return (
            orderDetail?.items?.reduce((pre, cur) => {
                return pre + (cur.sku ? cur.sku.price : cur.product.salePrice) * cur.quantity;
            }, 0) || 0
        );
    }, [orderDetail?.items]);

    const columns: ProColumns<API.Order>[] = [
        {
            title: '商品合计',
            dataIndex: 'icon',
            render: () => {
                return <div style={{ padding: '20px' }}>¥{totalProductPrice / 100}</div>;
            },
        },
        {
            title: '运费',
            dateIndex: 'deliveryFee',
        },
        {
            title: '通用券',
            dataIndex: 'generalCoupon',
            render: (dom: any, record: API.Order) => {
                if (record.generalCouponItem && record.generalCouponItem.coupon) {
                    return <div>-¥{record.generalCouponItem.coupon.value / 100}</div>;
                } else {
                    return <div>-</div>;
                }
            },
        },
        {
            title: '订单总金额',
            dataIndex: 'totalPrice',
            render: (dom: any, record: API.Order) => {
                return <h3 className={'danger-color'}>¥{record.totalPrice / 100}</h3>;
            },
        },
    ];
    return (
        <>
            <ProCard
                title={
                    <Space>
                        <BookFilled />
                        <span>价格信息</span>
                    </Space>
                }
                type="inner"
                bordered
            >
                <ProDescriptions
                    columns={columns}
                    dataSource={orderDetail}
                    bordered={true}
                    layout={'vertical'}
                    column={5}
                ></ProDescriptions>
            </ProCard>
        </>
    );
};

export default OrderBaseInfo;
