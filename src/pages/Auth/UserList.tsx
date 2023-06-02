import React, { useRef, useState } from 'react';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Space, Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { FormattedMessage } from '@@/exports';
import { user } from '@/services/ant-design-pro/api';
import CreateUserModal from '@/pages/Auth/components/CreateUserModal';

const UserList: React.FC = () => {
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const switchOpen = () => {};
    const valueEnum = new Map([
        [0, '是'],
        [1, '否'],
    ]);
    const columns: ProColumns<API.CurrentUser>[] = [
        {
            title: '编号',
            dataIndex: 'id',
            search: false,
        },
        {
            title: '账号',
            dataIndex: 'username',
        },
        {
            title: '姓名',
            dataIndex: 'nickname',
            render: (_, record) => {
                return <span>{record.profile?.nickName}</span>;
            },
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            render: (_, record) => {
                return <span>{record.profile?.email}</span>;
            },
        },
        {
            title: '添加时间',
            valueType: 'dateTime',
            dataIndex: 'createdAt',
            search: false,
        },
        {
            title: '是否启用',
            dataIndex: 'isDeleted',
            valueType: 'select',
            valueEnum,
            render: (_, record) => {
                return <Switch defaultChecked={!record.deletedAt} onChange={switchOpen} />;
            },
        },
        {
            title: '操作',
            dataIndex: 'action',
            search: false,
            render: (_, record) => {
                return (
                    <Space>
                        <a href="" onClick={() => {}}>
                            编辑
                        </a>
                        <a href="" onClick={() => {}}>
                            删除
                        </a>
                    </Space>
                );
            },
        },
    ];
    return (
        <PageContainer>
            <ProTable<API.CurrentUser, API.PageParams>
                headerTitle={'用户列表'}
                actionRef={actionRef}
                rowKey="id"
                search={{
                    showHiddenNum: true,
                    span: {
                        xs: 24,
                        sm: 24,
                        md: 12,
                        lg: 12,
                        xl: 8,
                        xxl: 6,
                    },
                }}
                toolBarRender={() => [
                    <Button
                        type="primary"
                        key="primary"
                        onClick={() => {
                            handleModalOpen(true);
                        }}
                    >
                        <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
                    </Button>,
                ]}
                request={user}
                columns={columns}
            />
            <CreateUserModal
                createModalOpen={createModalOpen}
                handleModalOpen={handleModalOpen}
                actionRef={actionRef}
            />
        </PageContainer>
    );
};

export default UserList;
