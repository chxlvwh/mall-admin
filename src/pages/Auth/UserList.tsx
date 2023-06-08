import React, { useRef, useState } from 'react';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Modal, Space, Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { FormattedMessage, useModel } from '@@/exports';
import { deleteUser, getUserById, restoreUser, user } from '@/services/mall-service/api';
import CreateUserModal from '@/pages/Auth/components/CreateUserModal';
import { searchProps } from '@/utils/consts';

const UserList: React.FC = () => {
    const { initialState } = useModel('@@initialState');
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const [currentRow, setCurrentRow] = useState<API.CurrentUser>();
    const actionRef = useRef<ActionType>();
    const switchOpen = async (val: boolean, id: number) => {
        Modal.confirm({
            title: '确认',
            content: `确认${val ? '启用' : '关闭'}账户吗`,
            onOk: async () => {
                try {
                    if (val) {
                        await restoreUser(id);
                    } else {
                        await deleteUser(id);
                    }
                    actionRef.current?.reload();
                } catch (e) {
                    actionRef.current?.reload();
                }
            },
        });
    };
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
            title: '姓名',
            dataIndex: 'nickname',
            render: (_, record) => {
                return <span>{record.profile?.nickname}</span>;
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
            title: '最后修改时间',
            valueType: 'dateTime',
            dataIndex: 'lastModifiedAt',
            search: false,
        },
        {
            title: '是否启用',
            dataIndex: 'isDeleted',
            valueType: 'select',
            valueEnum,
            render: (_, record) => {
                return (
                    <Switch
                        disabled={initialState?.currentUser?.id === record.id}
                        checked={!record.deletedAt}
                        onChange={(val) => switchOpen(val, record.id)}
                    />
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
                                const { data: userDetail } = await getUserById(record.id);
                                setCurrentRow(userDetail);
                                handleModalOpen(true);
                            }}
                        >
                            编辑
                        </Button>
                    </Space>
                );
            },
        },
    ];
    return (
        <PageContainer fixedHeader={true}>
            <ProTable<API.CurrentUser, API.PageParams>
                cardBordered={true}
                revalidateOnFocus={false}
                headerTitle={'用户列表'}
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
                request={user}
                columns={columns}
            />
            {createModalOpen && (
                <CreateUserModal
                    createModalOpen={createModalOpen}
                    handleModalOpen={handleModalOpen}
                    actionRef={actionRef}
                    currentRow={currentRow}
                />
            )}
        </PageContainer>
    );
};

export default UserList;
