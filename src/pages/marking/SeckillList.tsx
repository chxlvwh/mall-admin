import { DATE_FORMAT, searchProps } from '@/constants/consts';
import CreateSeckillModal from '@/pages/marking/components/CreateSeckillModal';
import { deleteSeckill, getSeckillById, getSeckillList, updateSeckill } from '@/services/mall-service/api';
import { FormattedMessage } from '@@/exports';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Modal, Space, Switch } from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';

const SeckillList: React.FC = () => {
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const [currentRow, setCurrentRow] = useState<API.Seckill>();
    const actionRef = useRef<ActionType>();
    const switchChange = async (isOnline: boolean, detail: API.Seckill) => {
        Modal.confirm({
            title: '确认',
            content: isOnline ? `确定上线【${detail.title}】活动吗？` : `确定下线【${detail.title}】活动吗？`,
            onOk: async () => {
                await updateSeckill(detail.id, { ...detail, isOnline: isOnline ? 1 : 0 });
                if (actionRef.current) actionRef.current?.reload();
            },
        });
    };
    const columns: ProColumns<API.Seckill>[] = [
        {
            title: '编号',
            dataIndex: 'id',
            search: false,
        },
        {
            title: '活动标题',
            dataIndex: 'title',
        },
        {
            title: '活动状态',
            dataIndex: 'status',
            render: (dom: any, record: API.Seckill) => {
                switch (record.status) {
                    case 1:
                        return '进行中';
                    case 2:
                        return '已结束';
                    default:
                        return '未开始';
                }
            },
            valueEnum: new Map([
                [0, '进行中'],
                [1, '已结束'],
                [2, '未开始'],
            ]),
        },
        {
            title: '开始时间',
            dataIndex: 'startDate',
            search: false,
            render: (dom: any, record: API.Seckill) => {
                return <div>{dayjs(record.startDate).format(DATE_FORMAT)}</div>;
            },
        },
        {
            title: '结束时间',
            dataIndex: 'endDate',
            search: false,
            render: (dom: any, record: API.Seckill) => {
                return <div>{dayjs(record.endDate).format(DATE_FORMAT)}</div>;
            },
        },
        {
            title: '上线/下线',
            dataIndex: 'isOnline',
            render: (dom: any, record: API.Seckill) => {
                return <Switch onChange={(checked) => switchChange(checked, record)} checked={!!record.isOnline} />;
            },
            valueEnum: new Map([
                [0, '下线'],
                [1, '上线'],
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
            render: (_: any, record: API.Seckill) => {
                return (
                    <Space>
                        <Button
                            type={'primary'}
                            onClick={async (event) => {
                                event.preventDefault();
                                const { data: detail } = await getSeckillById(record.id);
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
                                    content: `确定要删除活动【${record.title}】吗？`,
                                    onOk: async () => {
                                        await deleteSeckill(record.id);
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
            <ProTable<API.Seckill, API.PageParams & API.Seckill>
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
                request={getSeckillList}
                columns={columns}
            />
            <CreateSeckillModal
                createModalOpen={createModalOpen}
                handleModalOpen={handleModalOpen}
                actionRef={actionRef}
                currentRow={currentRow}
            />
        </PageContainer>
    );
};

export default SeckillList;
