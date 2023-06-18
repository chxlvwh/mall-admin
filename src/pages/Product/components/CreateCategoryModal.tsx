import { addCategory, getCategoryTree, updateCategory } from '@/services/mall-service/api';
import { ActionType, ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { ProFormCascader, ProFormDigit } from '@ant-design/pro-form/lib';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';

interface CreateCategoryModalProps {
    createModalOpen: boolean;
    handleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    actionRef: React.MutableRefObject<ActionType | undefined>;
    currentRow?: API.Category;
}

const handleAdd = async (fields: API.Category) => {
    if (Array.isArray(fields.parentId) && fields.parentId.length) {
        fields.parentId = fields.parentId[fields.parentId.length - 1];
    } else {
        fields.parentId = 0;
    }
    const hide = message.loading('正在添加');
    try {
        await addCategory({ ...fields });
        hide();
        message.success('添加成功');
        return true;
    } catch (error) {
        hide();
        return false;
    }
};

const handleUpdate = async (id: number, fields: API.Category) => {
    if (Array.isArray(fields.parentId) && fields.parentId.length) {
        fields.parentId = fields.parentId[fields.parentId.length - 1];
    } else {
        fields.parentId = 0;
    }
    const hide = message.loading('正在更新');
    try {
        await updateCategory(id, { ...fields });
        hide();
        message.success('更新成功');
        return true;
    } catch (error) {
        hide();
        return false;
    }
};

const CreateCategoryModal = ({ createModalOpen, handleModalOpen, actionRef, currentRow }: CreateCategoryModalProps) => {
    const isEdit = currentRow && !!currentRow.id;
    const [categoryTree, setCategoryTree] = useState<API.Category[]>();
    const getALLCategories = () => {
        getCategoryTree().then((res) => {
            const topCategory = [{ name: '无', id: 0 }];
            setCategoryTree(topCategory.concat(res.data));
        });
    };
    useEffect(() => {
        if (createModalOpen) {
            getALLCategories();
        }
    }, [createModalOpen]);
    return (
        <ModalForm
            layout={'horizontal'}
            labelCol={{ span: 5 }}
            title={isEdit ? '更新分类' : '创建分类'}
            modalProps={{ destroyOnClose: true }}
            open={createModalOpen}
            onOpenChange={handleModalOpen}
            onFinish={async (value) => {
                console.log('[CreateCategoryModal.tsx:] ', value);
                let success = false;
                if (!isEdit) {
                    success = await handleAdd(value as API.Category);
                } else {
                    success = await handleUpdate(currentRow.id, value as API.Category);
                }
                if (success) {
                    handleModalOpen(false);
                    getALLCategories();
                    if (actionRef.current) {
                        actionRef.current.reload();
                    }
                }
            }}
        >
            <ProFormText
                initialValue={currentRow?.name}
                label="分类名称"
                rules={[
                    {
                        required: true,
                        message: '分类名称不能为空',
                    },
                ]}
                width="md"
                name="name"
            />
            <ProFormCascader
                initialValue={currentRow?.parent?.name}
                name="parentId"
                label="上级分类"
                width={'md'}
                fieldProps={{
                    options: categoryTree,
                    fieldNames: { label: 'name', value: 'id' },
                    showSearch: true,
                    changeOnSelect: true,
                }}
                placeholder="请选择一个父级分类，创建一级分类请选无"
                params={undefined}
                debounceTime={undefined}
                valueEnum={undefined}
                request={undefined}
            />
            <ProFormDigit initialValue={currentRow?.order} label="排序" width="md" name="order" />
            <ProFormTextArea initialValue={currentRow?.desc} label="分类描述" width="lg" name="desc" />
        </ModalForm>
    );
};

export default CreateCategoryModal;
