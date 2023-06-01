import React, { useRef } from 'react';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { FormattedMessage } from '@@/exports';
import { user } from '@/services/ant-design-pro/api';

const UserList: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const switchOpen = () => {};
    const valueEnum = new Map([
        [true, '是'],
        [false, '否'],
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
                    <div>
                        <a href="" onClick={() => {}} style={{ marginRight: '20px' }}>
                            编辑
                        </a>
                        <a href="" onClick={() => {}}>
                            删除
                        </a>
                    </div>
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
                    labelWidth: 100,
                }}
                toolBarRender={() => [
                    <Button
                        type="primary"
                        key="primary"
                        onClick={() => {
                            // handleModalOpen(true);
                        }}
                    >
                        <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
                    </Button>,
                ]}
                request={user}
                columns={columns}
            />
        </PageContainer>
    );
};

export default UserList;
