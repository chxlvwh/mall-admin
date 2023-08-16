import { addRecommendBrand, getBrandList, getRecommendBrandByIds } from '@/services/mall-service/api';
import { ActionType, ModalForm, ProTable } from '@ant-design/pro-components';
import { Space } from 'antd';
import Search from 'antd/es/input/Search';
import React, { useEffect, useState } from 'react';

interface SelectBrandModalProps {
    createModalOpen: boolean;
    handleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    actionRef: React.MutableRefObject<ActionType | undefined>;
}
const SelectBrandModal: React.FC<SelectBrandModalProps> = ({ createModalOpen, handleModalOpen, actionRef }) => {
    const [brandList, setBrandList] = useState<API.Brand[]>([]);
    const [selectedRows, setSelectedRows] = useState<API.Brand[]>([]);
    const [total, setTotal] = useState(0);
    const [defaultIds, setDefaultIds] = useState<number[]>([]);
    const [loadSuccess, setLoadSuccess] = useState(false);
    const pageSize = 5;

    const onSearch = (value: string) => {
        getBrandList({ name: value, pageSize }).then((res) => {
            setBrandList(res.data);
            setTotal(res.total);
            getRecommendBrandByIds(res.data.map((item) => item.id)).then((res) => {
                setDefaultIds(res.data.map((item) => item.brand.id));
                setLoadSuccess(true);
            });
        });
    };

    useEffect(() => {
        if (!createModalOpen) return;
        onSearch('');
    }, [createModalOpen]);

    const columns = [
        {
            title: '品牌名称',
            dataIndex: 'name',
        },
        {
            title: '相关',
            dataIndex: 'relation',
            render: () => {
                return (
                    <Space>
                        <span>
                            商品：<span className={'primary-color'}>100</span>
                        </span>
                        <span>
                            评价：<span className={'primary-color'}>100</span>
                        </span>
                    </Space>
                );
            },
        },
    ];

    return (
        <ModalForm
            title={'选择品牌'}
            modalProps={{ destroyOnClose: true }}
            open={createModalOpen}
            onOpenChange={handleModalOpen}
            onFinish={async () => {
                const brandIds = selectedRows.map((item) => item.id);
                if (brandIds.length === 0) return;
                addRecommendBrand({ brandIds }).then(() => {
                    handleModalOpen(false);
                    actionRef.current?.reload();
                });
            }}
        >
            <Search className={'half-width mb'} name="name" enterButton={'Search'} allowClear onSearch={onSearch} />
            {loadSuccess && (
                <ProTable
                    rowKey="id"
                    search={false}
                    toolBarRender={false}
                    className={'vertical-margin-20'}
                    columns={columns}
                    dataSource={brandList}
                    alwaysShowAlert={true}
                    rowSelection={{
                        // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
                        // 注释该行则默认不显示下拉选项
                        selections: false,
                        defaultSelectedRowKeys: defaultIds,
                        onChange: (_: any, selectedRows: React.SetStateAction<API.Brand[]>) => {
                            setSelectedRows(selectedRows);
                        },
                    }}
                    tableAlertRender={false}
                    tableAlertOptionRender={false}
                    pagination={{ total, pageSize }}
                ></ProTable>
            )}
        </ModalForm>
    );
};

export default SelectBrandModal;
