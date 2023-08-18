import { getProductList } from '@/services/mall-service/api';
import { ActionType, ModalForm, ProTable } from '@ant-design/pro-components';
import Search from 'antd/es/input/Search';
import React, { useEffect, useState } from 'react';

interface SelectProductModalProps {
    createModalOpen: boolean;
    handleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    actionRef: React.MutableRefObject<ActionType | undefined>;
    createFn: ({ productIds }: { productIds: number[] }) => Promise<any>;
    getByIdsFn: (productIds: number[]) => Promise<{ data: API.RecommendNew[] }>;
}
const SelectProductModal: React.FC<SelectProductModalProps> = ({
    createModalOpen,
    handleModalOpen,
    actionRef,
    createFn,
    getByIdsFn,
}) => {
    const [productList, setProductList] = useState<API.Product[]>([]);
    const [selectedRows, setSelectedRows] = useState<API.Product[]>([]);
    const [total, setTotal] = useState(0);
    const [defaultIds, setDefaultIds] = useState<number[]>([]);
    const [loadSuccess, setLoadSuccess] = useState(false);
    const pageSize = 5;

    const onSearch = (value: string) => {
        getProductList({ name: value, pageSize }).then((res) => {
            setProductList(res.data);
            setTotal(res.total);
            getByIdsFn(res.data.map((item) => item.id)).then((res) => {
                setDefaultIds(res.data.map((item) => item.product.id));
                setLoadSuccess(true);
            });
        });
    };

    useEffect(() => {
        if (!createModalOpen) return;
        setDefaultIds([]);
        onSearch('');
    }, [createModalOpen]);

    const columns = [
        {
            title: '商品名称',
            dataIndex: 'name',
        },
        {
            title: '价格',
            dataIndex: 'price',
            render: (_: any, record: API.Product) => {
                return <div>{record.salePrice / 100}</div>;
            },
        },
        {
            title: '货号',
            dataIndex: 'itemNo',
        },
    ];

    return (
        <ModalForm
            title={'选择商品'}
            modalProps={{ destroyOnClose: true }}
            open={createModalOpen}
            onOpenChange={handleModalOpen}
            onFinish={async () => {
                const productIds = selectedRows.map((item) => item.id).filter((item) => !defaultIds.includes(item));
                if (productIds.length === 0) {
                    handleModalOpen(false);
                    return;
                }
                createFn({ productIds }).then(() => {
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
                    dataSource={productList}
                    alwaysShowAlert={true}
                    rowSelection={{
                        // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
                        // 注释该行则默认不显示下拉选项
                        selections: false,
                        defaultSelectedRowKeys: [],
                        onChange: (_: any, selectedRows: React.SetStateAction<API.Product[]>) => {
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

export default SelectProductModal;
