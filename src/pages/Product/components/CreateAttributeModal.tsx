import React from 'react';
import { ActionType, ModalForm, ProFormRadio, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { ProForm, ProFormSelect } from '@ant-design/pro-form/lib';
import { message } from 'antd';
import { addAttr, updateAttr } from '@/services/mall-service/api';

interface CreateAttrModalProps {
    createModalOpen: boolean;
    handleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    actionRef: React.MutableRefObject<ActionType | undefined>;
    currentRow?: API.Attribute;
}

const handleAdd = async (fields: API.Attribute) => {
    const hide = message.loading('正在添加');
    try {
        if (fields.value) {
            fields.value = fields.value.replace(/\s/g, ',');
        }
        if (fields.entryMethod === 1) {
            fields.value = '';
        }
        await addAttr({ ...fields });
        hide();
        message.success('添加成功');
        return true;
    } catch (error) {
        hide();
        message.error('添加失败，请重试!');
        return false;
    }
};

const handleUpdate = async (id: number, fields: API.Attribute) => {
    console.log('[CreateUserModal.tsx:] ', fields);
    const hide = message.loading('正在更新');
    try {
        if (fields.value) {
            fields.value = fields.value.replace(/\s/g, ',');
        }
        if (fields.entryMethod === 1) {
            fields.value = '';
        }
        await updateAttr(id, { ...fields });
        hide();
        message.success('更新成功');
        return true;
    } catch (error) {
        hide();
        message.error('更新失败，请重试!');
        return false;
    }
};

const CreateBrandModal = ({ createModalOpen, handleModalOpen, actionRef, currentRow }: CreateAttrModalProps) => {
    const isEdit = currentRow && !!currentRow.id;
    console.log('[isEdit:] ', isEdit);
    return (
        <ModalForm
            layout={'horizontal'}
            labelCol={{ span: 5 }}
            title={isEdit ? '更新属性' : '创建属性'}
            modalProps={{ destroyOnClose: true }}
            open={createModalOpen}
            onOpenChange={handleModalOpen}
            onFinish={async (value) => {
                let success = false;
                if (!isEdit) {
                    success = await handleAdd(value as API.Attribute);
                } else {
                    success = await handleUpdate(currentRow.id, value as API.Attribute);
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
                label="属性名称"
                rules={[
                    {
                        required: true,
                    },
                ]}
                width="md"
                name="name"
            />
            <ProFormRadio.Group
                initialValue={currentRow?.entryMethod}
                label="录入方式"
                rules={[
                    {
                        required: true,
                        message: '请选择录入方式',
                    },
                ]}
                options={[
                    {
                        label: '手动录入',
                        value: 1,
                    },
                    {
                        label: '列表选择',
                        value: 2,
                    },
                ]}
                name="entryMethod"
            />
            <ProFormTextArea
                initialValue={currentRow?.value && currentRow.value.replaceAll(',', '\n')}
                label="可选值"
                width="md"
                name="value"
            />
            <ProFormRadio.Group
                initialValue={currentRow?.isRequired}
                label="是否必填"
                rules={[
                    {
                        required: true,
                        message: '请选择是否必填',
                    },
                ]}
                options={[
                    {
                        label: '是',
                        value: 1,
                    },
                    {
                        label: '否',
                        value: 0,
                    },
                ]}
                name="isRequired"
            />
            <ProFormRadio.Group
                fieldProps={{}}
                initialValue={currentRow?.canSearch}
                label="是否可搜索"
                rules={[
                    {
                        required: true,
                        message: '请选择是否可搜索',
                    },
                ]}
                options={[
                    {
                        label: '是',
                        value: 1,
                    },
                    {
                        label: '否',
                        value: 0,
                    },
                ]}
                name="canSearch"
            />
            <ProFormSelect
                fieldProps={{}}
                initialValue={currentRow?.type}
                label="属性类型"
                rules={[
                    {
                        required: true,
                        message: '请选择属性类型',
                    },
                ]}
                options={[
                    {
                        label: '基本属性',
                        value: 1,
                    },
                    {
                        label: '规格参数',
                        value: 2,
                    },
                ]}
                width={'md'}
                name="type"
            />
            <ProFormTextArea initialValue={currentRow?.desc} label="属性描述" width="xl" name="desc" />
        </ModalForm>
    );
};

export default CreateBrandModal;
