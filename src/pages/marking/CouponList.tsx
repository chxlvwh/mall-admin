import CreateCouponModal from '@/components/coupon/CreateCouponModal';
import { searchProps } from '@/constants/consts';
import { deleteCoupon, getCouponById, getCouponList } from '@/services/mall-service/api';
import { getDateTime } from '@/utils/utils';
import { FormattedMessage } from '@@/exports';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Modal, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';

const CouponList = () => {
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const [currentRow, setCurrentRow] = useState<API.Coupon>();
    const actionRef = useRef<ActionType>();
    const columns: ProColumns<API.Coupon>[] = [
        {
            title: '编号',
            dataIndex: 'id',
            search: false,
        },
        {
            title: '优惠券名称',
            dataIndex: 'name',
            render: (dom: string, record: API.Coupon) => {
                return (
                    <a
                        onClick={async (event) => {
                            event.preventDefault();
                            const { data: detail } = await getCouponById(record.id);
                            setCurrentRow(detail);
                            handleModalOpen(true);
                        }}
                    >
                        {dom}
                    </a>
                );
            },
        },
        {
            title: '优惠券类型',
            dataIndex: 'type',
            render: (dom: any, record: API.Coupon) => {
                switch (record.type) {
                    case 'DISCOUNT_AMOUNT':
                        return '满减优惠';
                    case 'PERCENTAGE':
                        return '打折';
                    case 'PAY_AMOUNT':
                        return '直减';
                    default:
                        return '未知';
                }
            },
            valueEnum: new Map([
                ['DISCOUNT_AMOUNT', '满减优惠'],
                // ['PERCENTAGE', '打折'],
                // ['PAY_AMOUNT', '直减'],
            ]),
        },
        {
            title: '使用门槛',
            dataIndex: 'threshold',
            search: false,
        },
        {
            title: '面值',
            dataIndex: 'value',
            search: false,
        },
        {
            title: '有效期',
            render: (dom: any, record: API.Coupon) => {
                return (
                    <div>
                        {getDateTime(record.startDate)} ~ {getDateTime(record.endDate)}
                    </div>
                );
            },
            valueType: 'dateTimeRange',
            fieldProps: {
                showTime: {
                    defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
                },
            },
            search: {
                transform: (value: any) => ({ startDate: value[0], endDate: value[1] }),
            },
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: (dom: string, record: API.Coupon) => {
                switch (record.status) {
                    case 'NOT_STARTED':
                        return <Tag color={'blue'}>未开始</Tag>;
                    case 'ONGOING':
                        return <Tag color={'green'}>进行中</Tag>;
                    case 'EXPIRED':
                        return <Tag color={'error'}>已过期</Tag>;
                    case 'ENDED':
                        return <Tag color={'red'}>手动结束</Tag>;
                    case 'FINISHED':
                        return <Tag color={'gold'}>已领完</Tag>;

                    default:
                        return '未知';
                }
            },
            valueEnum: new Map([
                ['NOT_STARTED', '未开始'],
                ['ONGOING', '进行中'],
                ['EXPIRED', '已过期'],
                ['ENDED', '手动结束'],
                ['FINISHED', '已领完'],
            ]),
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
            render: (_: any, record: API.Coupon) => {
                return (
                    <Space>
                        <Button
                            type={'primary'}
                            onClick={async (event) => {
                                event.preventDefault();
                                const { data: detail } = await getCouponById(record.id);
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
                                    content: `确定要删除优惠券【${record.name}】吗？`,
                                    onOk: async () => {
                                        await deleteCoupon(record.id);
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
            <ProTable<API.Coupon, API.PageParams & API.Coupon>
                headerTitle={'优惠券列表'}
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
                request={getCouponList}
                columns={columns}
            />
            <CreateCouponModal
                createModalOpen={createModalOpen}
                handleModalOpen={handleModalOpen}
                actionRef={actionRef}
                currentRow={currentRow}
            />
        </PageContainer>
    );
};

export default CouponList;
