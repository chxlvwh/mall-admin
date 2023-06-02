import React, { useState } from 'react';
import { ActionType, ModalForm, ProFormRadio, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { FormattedMessage } from '@@/exports';
import { ProForm } from '@ant-design/pro-form/lib';
import { message, Space } from 'antd';
import { addRule, addUser } from '@/services/ant-design-pro/api';

interface CreateUserModalProps {
    createModalOpen: boolean;
    handleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    actionRef: React.MutableRefObject<ActionType | undefined>;
}

const handleAdd = async (fields: API.CurrentUser) => {
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

const CreateUserModal = ({ createModalOpen, handleModalOpen, actionRef }: CreateUserModalProps) => {
    return (
        <ModalForm
            title={'创建用户'}
            // width="400px"
            open={createModalOpen}
            onOpenChange={handleModalOpen}
            onFinish={async (value) => {
                console.log('[CreateUserModal.tsx:] ', value);
                const success = await handleAdd(value as API.CurrentUser);
                if (success) {
                    handleModalOpen(false);
                    if (actionRef.current) {
                        actionRef.current.reload();
                    }
                }
            }}
        >
            <ProForm.Group>
                <ProFormText
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
                <ProFormText label="姓名" width="md" name="nickname" />
                <ProFormText label="邮箱" width="md" name="email" />
                <ProFormTextArea label={'备注'} width="md" name="remark" />
                <ProFormRadio.Group
                    name={'isDeleted'}
                    label={'是否启用'}
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
            </ProForm.Group>
        </ModalForm>
    );
};

export default CreateUserModal;
