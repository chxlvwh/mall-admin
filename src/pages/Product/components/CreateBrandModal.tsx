import React from 'react';
import { ActionType, ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { ProForm } from '@ant-design/pro-form/lib';
import { message } from 'antd';
import { addBrand, updateBrand } from '@/services/mall-service/api';

interface CreateBrandModalProps {
    createModalOpen: boolean;
    handleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    actionRef: React.MutableRefObject<ActionType | undefined>;
    currentRow?: API.Brand;
}

const handleAdd = async (fields: API.Brand) => {
    console.log('[CreateUserModal.tsx:] ', fields);
    const hide = message.loading('正在添加');
    try {
        await addBrand({ ...fields });
        hide();
        message.success('添加成功');
        return true;
    } catch (error) {
        hide();
        message.error('添加失败，请重试!');
        return false;
    }
};

const handleUpdate = async (id: number, fields: API.Brand) => {
    console.log('[CreateUserModal.tsx:] ', fields);
    const hide = message.loading('正在更新');
    try {
        await updateBrand(id, { ...fields });
        hide();
        message.success('更新成功');
        return true;
    } catch (error) {
        hide();
        message.error('更新失败，请重试!');
        return false;
    }
};

const CreateBrandModal = ({ createModalOpen, handleModalOpen, actionRef, currentRow }: CreateBrandModalProps) => {
    const isEdit = currentRow && !!currentRow.id;
    console.log('[isEdit:] ', isEdit);
    return (
        <ModalForm
            layout={'horizontal'}
            labelCol={{ span: 5 }}
            title={isEdit ? '更新品牌' : '创建品牌'}
            modalProps={{ destroyOnClose: true }}
            open={createModalOpen}
            onOpenChange={handleModalOpen}
            onFinish={async (value) => {
                console.log('[CreateBrandModal.tsx:] ', value);
                let success = false;
                if (!isEdit) {
                    success = await handleAdd(value as API.Brand);
                } else {
                    success = await handleUpdate(currentRow.id, value as API.Brand);
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
                initialValue={currentRow?.name}
                label="品牌名称"
                rules={[
                    {
                        required: true,
                        message: '品牌名称不能为空',
                    },
                ]}
                width="md"
                name="name"
            />
            <ProFormTextArea initialValue={currentRow?.desc} label="品牌描述" width="lg" name="desc" />
        </ModalForm>
    );
};

export default CreateBrandModal;
