import {
    addRefundReason,
    deleteRefundReason,
    getRefundReasonById,
    getRefundReasonList,
    updateRefundReason,
} from '@/services/mall-service/api';
import { FormattedMessage } from '@@/exports';
import { PlusOutlined } from '@ant-design/icons';
import {
    ActionType,
    ModalForm,
    PageContainer,
    ProColumns,
    ProFormTextArea,
    ProTable,
} from '@ant-design/pro-components';
import { ProFormDigit } from '@ant-design/pro-form/lib';
import { Button, Modal, Space } from 'antd';
import React, { useRef, useState } from 'react';

const RefundReasonList: React.FC = () => {
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const [currentRow, setCurrentRow] = useState<API.RefundReason>();
    const actionRef = useRef<ActionType>();
    const columns: ProColumns<API.RefundReason>[] = [
        {
            title: '编号',
            dataIndex: 'id',
            search: false,
        },
        {
            title: '原因',
            dataIndex: 'value',
            search: false,
        },
        {
            title: '排序',
            dataIndex: 'sort',
            search: false,
        },
        {
            title: '操作',
            dataIndex: 'action',
            search: false,
            render: (_: any, record: API.RefundReason) => {
                return (
                    <Space>
                        <Button
                            type={'primary'}
                            onClick={async (event) => {
                                event.preventDefault();
                                const { data: detail } = await getRefundReasonById(record.id);
                                setCurrentRow(detail);
                                handleModalOpen(true);
                            }}
                        >
                            编辑
                        </Button>
                        <Button
                            type={'primary'}
                            danger
                            onClick={async (event) => {
                                event.preventDefault();
                                Modal.confirm({
                                    title: '确认',
                                    content: `确定要删除吗？`,
                                    onOk: async () => {
                                        await deleteRefundReason(record.id);
                                        if (actionRef.current) {
                                            actionRef.current.reload();
                                        }
                                    },
                                });
                            }}
                        >
                            删除
                        </Button>
                    </Space>
                );
            },
        },
    ];
    return (
        <PageContainer>
            <ProTable<API.RefundReason>
                headerTitle={'退款原因列表'}
                actionRef={actionRef}
                rowKey="id"
                search={false}
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
                request={getRefundReasonList}
                columns={columns}
            />
            <ModalForm
                layout={'horizontal'}
                title={currentRow ? '编辑退款原因' : '新建退款原因'}
                width="500px"
                autoFocusFirstInput
                labelCol={{ span: 5 }}
                open={createModalOpen}
                initialValues={currentRow}
                modalProps={{ destroyOnClose: true, onCancel: () => handleModalOpen(false) }}
                onFinish={async (values) => {
                    if (currentRow) {
                        await updateRefundReason(currentRow.id, values);
                    } else {
                        await addRefundReason(values);
                    }
                    handleModalOpen(false);
                    if (actionRef.current) {
                        actionRef.current.reload();
                    }
                    return true;
                }}
            >
                <ProFormTextArea
                    width="md"
                    name="value"
                    label="原因"
                    placeholder="请输入"
                    rules={[{ required: true, message: '请输入原因' }]}
                />
                <ProFormDigit width="xs" name="sort" label="排序" placeholder="请输入" />
            </ModalForm>
        </PageContainer>
    );
};

export default RefundReasonList;
