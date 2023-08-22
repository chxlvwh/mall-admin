import { addSeckill, updateSeckill } from '@/services/mall-service/api';
import { ActionType, ModalForm, ProFormRadio, ProFormText } from '@ant-design/pro-components';
import { ProFormDateTimeRangePicker } from '@ant-design/pro-form';
import { Form, message } from 'antd';
import React from 'react';

interface CreateSeckillModalProps {
    createModalOpen: boolean;
    handleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    actionRef: React.MutableRefObject<ActionType | undefined>;
    currentRow?: API.Seckill;
}

const CreateSeckillModal: React.FC<CreateSeckillModalProps> = ({
    createModalOpen,
    handleModalOpen,
    actionRef,
    currentRow,
}) => {
    const [form] = Form.useForm();
    const isEdit = currentRow && !!currentRow.id;

    const handleAdd = async (value: API.Seckill & { startEndDate: Date[] }) => {
        const { title, isOnline, startEndDate } = value;
        const [startDate, endDate] = startEndDate;
        const params = {
            isOnline,
            title,
            startDate: startDate,
            endDate: endDate,
        };
        try {
            await addSeckill(params);
            message.success('添加成功');
            return true;
        } catch (e) {
            return false;
        }
    };

    const handleUpdate = async (id: number, value: API.Seckill & { startEndDate: Date[] }) => {
        const { title, isOnline, startEndDate } = value;
        const [startDate, endDate] = startEndDate;
        const params = {
            isOnline,
            title,
            startDate: startDate,
            endDate: endDate,
        };
        try {
            await updateSeckill(id, params);
            message.success('更新成功');
            return true;
        } catch (error) {
            return false;
        }
    };

    return (
        <ModalForm
            form={form}
            layout={'horizontal'}
            labelCol={{ span: 5 }}
            title={isEdit ? '更新活动' : '添加活动'}
            modalProps={{ destroyOnClose: true }}
            open={createModalOpen}
            onOpenChange={handleModalOpen}
            onFinish={async (value) => {
                let successed = false;
                if (!isEdit) {
                    successed = await handleAdd(value as API.Seckill & { startEndDate: Date[] });
                } else {
                    successed = await handleUpdate(currentRow.id, value as API.Seckill & { startEndDate: Date[] });
                }
                if (successed) {
                    handleModalOpen(false);
                    if (actionRef.current) {
                        actionRef.current.reload();
                    }
                }
            }}
        >
            <ProFormText
                initialValue={currentRow?.title}
                label="活动标题"
                rules={[
                    {
                        required: true,
                        message: '活动标题不能为空',
                    },
                ]}
                width="md"
                name="title"
            />

            <ProFormDateTimeRangePicker
                initialValue={[currentRow?.startDate, currentRow?.endDate]}
                label="有效期"
                width="md"
                name="startEndDate"
                rules={[
                    {
                        required: true,
                        message: '有效期不能为空',
                    },
                ]}
                fieldProps={{
                    showTime: false,
                    format: 'YYYY-MM-DD',
                }}
            ></ProFormDateTimeRangePicker>
            <ProFormRadio.Group
                initialValue={currentRow?.isOnline || 0}
                radioType={'button'}
                label="上线/下线"
                width="md"
                name="isOnline"
                options={[
                    {
                        label: '上线',
                        value: 1,
                    },
                    {
                        label: '下线',
                        value: 0,
                    },
                ]}
                params={undefined}
                debounceTime={undefined}
                request={undefined}
                valueEnum={undefined}
            ></ProFormRadio.Group>
        </ModalForm>
    );
};

export default CreateSeckillModal;
