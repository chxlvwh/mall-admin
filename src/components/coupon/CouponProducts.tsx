import { getProductById, getProductList } from '@/services/mall-service/api';
import { ProForm } from '@ant-design/pro-form';
import { ProFormSelect } from '@ant-design/pro-form/lib';
import { Button, FormInstance, Space, Table } from 'antd';
import React from 'react';
import { Add_Product } from './CreateCouponModal';

interface CouponProductsProps {
    selectedProducts: Add_Product[];
    setSelectedProducts: React.Dispatch<React.SetStateAction<Add_Product[]>>;
    form: FormInstance;
}
const CouponProducts: React.FC<CouponProductsProps> = ({ form, selectedProducts, setSelectedProducts }) => {
    const addProduct = () => {
        const nextSelectedProducts = [...selectedProducts];
        const product = form.getFieldValue('product');
        if (product && !nextSelectedProducts.find((item) => item.key === product.key)) {
            nextSelectedProducts.push(product);
            setSelectedProducts(nextSelectedProducts);
            form.resetFields(['product']);
        }
    };
    const removeProduct = (key: string | number) => {
        const nextSelectedProducts = selectedProducts.filter((item) => item.key !== key);
        setSelectedProducts(nextSelectedProducts);
    };
    return (
        <>
            <ProForm.Group>
                <ProFormSelect
                    placeholder={'商品名称/商品编号'}
                    colon={false}
                    labelCol={{ span: 11 }}
                    showSearch={true}
                    label=" "
                    width="md"
                    name="product"
                    params={undefined}
                    debounceTime={500}
                    fieldProps={{
                        labelInValue: true,
                    }}
                    request={async (params: { keyWords: any }) => {
                        if (!params.keyWords) return [];
                        if (Number(params.keyWords)) {
                            const { data: data } = await getProductById(Number(params.keyWords));
                            return [{ label: data.name, value: data.id }];
                        } else {
                            const { data: list } = await getProductList({
                                current: 1,
                                pageSize: 10,
                                name: params.keyWords,
                            });
                            return list.map((it) => ({ label: it.name, value: it.id }));
                        }
                    }}
                    valueEnum={undefined}
                ></ProFormSelect>
                <Button type="primary" onClick={() => addProduct()}>
                    添加
                </Button>
            </ProForm.Group>
            <Table<Add_Product>
                rowKey="key"
                columns={[
                    {
                        title: '编号',
                        dataIndex: 'key',
                    },
                    {
                        title: '商品名称',
                        dataIndex: 'label',
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        render: (_: any, record: Add_Product) => {
                            return (
                                <Space>
                                    <Button
                                        type={'link'}
                                        onClick={async (event) => {
                                            event.preventDefault();
                                            removeProduct(record.key);
                                        }}
                                    >
                                        删除
                                    </Button>
                                </Space>
                            );
                        },
                    },
                ]}
                dataSource={selectedProducts}
                pagination={false}
                size="small"
            ></Table>
        </>
    );
};

export default CouponProducts;
