import React, { useEffect, useState } from 'react';
import { ActionType, ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { ProForm, ProFormDigit } from '@ant-design/pro-form/lib';
import { message } from 'antd';
import { addCategory, getCategoryList, updateCategory } from '@/services/mall-service/api';
import { ProSchemaValueEnumMap } from '@ant-design/pro-utils/lib';

interface CreateCategoryModalProps {
    createModalOpen: boolean;
    handleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    actionRef: React.MutableRefObject<ActionType | undefined>;
    currentRow?: API.Category;
}

const handleAdd = async (fields: API.Category) => {
    console.log('[CreateUserModal.tsx:] ', fields);
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
    const [topCategories, setTopCategories] = useState<ProSchemaValueEnumMap>();
    const getALLCategories = () => {
        getCategoryList({ current: 1, pageSize: 100 }).then((res) => {
            const newTopCategories: ProSchemaValueEnumMap = new Map();
            newTopCategories.set(0, { text: '无' });
            if (res.data) {
                res.data.forEach((item) => {
                    newTopCategories.set(item.id, { text: item.name });
                    // newTopCategories[item.id] = { text: item.name };
                });
                setTopCategories(newTopCategories);
            }
        });
    };
    useEffect(() => {
        getALLCategories();
    }, []);
    return (
        <ModalForm
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
            <ProForm.Group>
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
                <ProFormSelect
                    initialValue={currentRow?.parent?.name}
                    name="parentId"
                    label="上级分类"
                    width={'md'}
                    valueEnum={topCategories}
                    placeholder="请选择一个父级分类"
                />
                <ProFormDigit initialValue={currentRow?.order} label="排序" width="md" name="order" />
                <ProFormTextArea initialValue={currentRow?.desc} label="品牌描述" width="md" name="desc" />
            </ProForm.Group>
        </ModalForm>
    );
};

export default CreateCategoryModal;
