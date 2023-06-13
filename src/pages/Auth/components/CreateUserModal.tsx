import React from 'react';
import { ActionType, ModalForm, ProFormRadio, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { ProForm } from '@ant-design/pro-form/lib';
import { message } from 'antd';
import { addUser, updateUser } from '@/services/mall-service/api';

interface CreateUserModalProps {
    createModalOpen: boolean;
    handleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    actionRef: React.MutableRefObject<ActionType | undefined>;
    currentRow?: API.CurrentUser;
}

const handleAdd = async (fields: API.CurrentUser) => {
    console.log('[CreateUserModal.tsx:] ', fields);
    const hide = message.loading('正在添加');
    try {
        await addUser({ ...fields });
        hide();
        message.success('添加成功');
        return true;
    } catch (error) {
        hide();
        message.error('添加失败，请重试!');
        return false;
    }
};

const handleUpdate = async (id: number, fields: API.CurrentUser) => {
    console.log('[CreateUserModal.tsx:] ', fields);
    const hide = message.loading('正在更新');
    try {
        await updateUser(id, { ...fields });
        hide();
        message.success('更新成功');
        return true;
    } catch (error) {
        hide();
        message.error('更新失败，请重试!');
        return false;
    }
};

const CreateUserModal = ({ createModalOpen, handleModalOpen, actionRef, currentRow }: CreateUserModalProps) => {
    const isEdit = currentRow && !!currentRow.id;
    console.log('[isEdit:] ', isEdit);
    return (
        <ModalForm
            layout={'horizontal'}
            labelCol={{ span: 5 }}
            title={isEdit ? '更新用户' : '创建用户'}
            modalProps={{ destroyOnClose: true }}
            open={createModalOpen}
            onOpenChange={handleModalOpen}
            onFinish={async (value) => {
                console.log('[CreateUserModal.tsx:] ', value);
                let success = false;
                if (!isEdit) {
                    success = await handleAdd(value as API.CurrentUser);
                } else {
                    success = await handleUpdate(currentRow.id, value as API.CurrentUser);
                }
                if (success) {
                    handleModalOpen(false);
                    if (actionRef.current) {
                        actionRef.current.reload();
                    }
                }
            }}
        >
            <ProFormText
                initialValue={currentRow?.username}
                label="账号"
                rules={[
                    {
                        required: true,
                        message: '账号不能为空',
                    },
                ]}
                width="md"
                name="username"
            />
            {!isEdit && (
                <ProFormText
                    label="密码"
                    rules={[
                        {
                            required: true,
                            message: '密码不能为空',
                        },
                    ]}
                    width="md"
                    name="password"
                />
            )}
            {!isEdit && (
                <ProFormRadio.Group
                    initialValue={currentRow?.deletedAt ? 1 : 0}
                    name={'isDeleted'}
                    label={'是否启用'}
                    fieldProps={{ defaultValue: 0 }}
                    options={[
                        {
                            label: '是',
                            value: 0,
                        },
                        {
                            label: '否',
                            value: 1,
                        },
                    ]}
                ></ProFormRadio.Group>
            )}
            <ProFormText label="姓名" width="md" name="nickname" initialValue={currentRow?.profile?.nickname} />
            <ProFormText label="邮箱" width="md" name="email" initialValue={currentRow?.profile?.email} />
            <ProFormTextArea label={'备注'} width="lg" name="remark" initialValue={currentRow?.profile?.remark} />
        </ModalForm>
    );
};

export default CreateUserModal;
