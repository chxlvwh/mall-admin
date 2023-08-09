import { OrderStatus } from '@/pages/order/OrderList';
import { getOrderByOrderNo } from '@/services/mall-service/api';
import { getDateTime } from '@/utils/utils';

import OrderBaseInfo from '@/pages/order/components/OrderBaseInfo';
import OrderPriceInfo from '@/pages/order/components/OrderPriceInfo';
import OrderProducts from '@/pages/order/components/OrderProducts';
import OrderReceiverInfo from '@/pages/order/components/OrderReceiverInfo';
import { ExclamationCircleFilled } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { Space, StepProps, Steps } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';

interface OrderDetailProps {
    history: any;
}

const OrderDetail: React.FC<OrderDetailProps> = () => {
    const { orderNo } = useParams();
    const [orderDetail, setOrderDetail] = useState<API.Order>();
    useEffect(() => {
        getOrderByOrderNo(orderNo as string).then((res) => {
            setOrderDetail(res.data);
        });
    }, []);
    const orderStatus = ['UNPAID', 'PAID', 'DELIVERING', 'DELIVERED', 'CLOSED'];
    const statusIndex = useMemo(() => {
        if (orderDetail?.status === 'CLOSED') {
            return 1;
        }
        return orderStatus.findIndex((it) => it === orderDetail?.status);
    }, [orderDetail?.status]);
    const items: StepProps[] = [
        {
            title: '提交订单',
            status: 'finish',
            description: getDateTime(orderDetail?.createdAt),
        },
        {
            title: '支付订单',
            status: statusIndex > 1 ? 'finish' : statusIndex === 0 ? 'process' : 'wait',
            description: orderDetail?.paymentTime ? getDateTime(orderDetail?.paymentTime) : '',
        },
        {
            title: '平台发货',
            status: statusIndex > 2 ? 'finish' : statusIndex === 1 ? 'process' : 'wait',
            description: orderDetail?.deliveryTime ? getDateTime(orderDetail?.deliveryTime) : '',
        },
        {
            title: '确认收货',
            status: statusIndex > 3 ? 'finish' : statusIndex === 2 ? 'process' : 'wait',
            description: orderDetail?.receiveTime ? getDateTime(orderDetail?.receiveTime) : '',
        },
        {
            title: '完成评价',
            status: statusIndex > 4 ? 'finish' : statusIndex === 3 ? 'process' : 'wait',
            description: orderDetail?.commentTime ? getDateTime(orderDetail?.commentTime) : '',
        },
    ];
    return (
        <>
            <div style={{ padding: '10px' }}>
                <Steps type="navigation" current={statusIndex} items={items} />
            </div>
            <ProCard
                title={
                    <Space className={'danger-color'}>
                        <ExclamationCircleFilled />
                        {orderDetail && <span>当前订单状态：{OrderStatus[orderDetail.status]}</span>}
                    </Space>
                }
                bordered
                headerBordered
                direction="column"
                gutter={[0, 16]}
                style={{ marginBlockStart: 8 }}
            >
                <OrderBaseInfo orderDetail={orderDetail} />
                <OrderReceiverInfo receiver={orderDetail?.receiver} />
                <OrderProducts items={orderDetail?.items} />
                <OrderPriceInfo orderDetail={orderDetail} />
            </ProCard>
        </>
    );
};

export default OrderDetail;
