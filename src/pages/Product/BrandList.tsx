import { searchProps } from '@/constants/consts';
import CreateBrandModal from '@/pages/Product/components/CreateBrandModal';
import { deleteBrand, getBrandById, getBrandList } from '@/services/mall-service/api';
import { FormattedMessage } from '@@/exports';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Modal, Space } from 'antd';
import React, { useRef, useState } from 'react';

const BrandList: React.FC = () => {
    const [createModalOpen, handleModalOpen] = useState<boolean>(false);
    const [currentRow, setCurrentRow] = useState<API.Brand>();
    const actionRef = useRef<ActionType>();
    const columns: ProColumns<API.Brand>[] = [
        {
            title: '编号',
            dataIndex: 'id',
            search: false,
        },
        {
            title: '品牌名称',
            dataIndex: 'name',
            render: (dom: string, record: API.Brand) => {
                return (
                    <a
                        onClick={async (event) => {
                            event.preventDefault();
                            const { data: detail } = await getBrandById(record.id);
                            setCurrentRow(detail);
                            handleModalOpen(true);
                        }}
                    >
                        {dom}
                    </a>
                );
            },
        },
        {
            title: '品牌描述',
            dataIndex: 'desc',
            search: false,
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
            title: '操作',
            dataIndex: 'action',
            search: false,
            render: (_: any, record: API.Brand) => {
                return (
                    <Space>
                        <Button
                            type={'primary'}
                            onClick={async (event) => {
                                event.preventDefault();
                                const { data: brandDetail } = await getBrandById(record.id);
                                setCurrentRow(brandDetail);
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
                                    content: `确定要删除${record.name}品牌吗？`,
                                    onOk: () => {
                                        deleteBrand(record.id);
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
            <ProTable<API.Brand, API.PageParams>
                headerTitle={'品牌列表'}
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
                request={getBrandList}
                columns={columns}
            />
            <CreateBrandModal
                createModalOpen={createModalOpen}
                handleModalOpen={handleModalOpen}
                actionRef={actionRef}
                currentRow={currentRow}
            />
        </PageContainer>
    );
};

export default BrandList;
