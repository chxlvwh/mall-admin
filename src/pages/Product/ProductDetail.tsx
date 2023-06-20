import BaseInfoStepForm from '@/pages/Product/components/BaseInfoStepForm';
import CategoryStepForm from '@/pages/Product/components/CategoryStepForm';
import SaleStepForm from '@/pages/Product/components/SaleStepForm';
import { addProduct, getCategoryAttrs, getProductById } from '@/services/mall-service/api';
import ProCard from '@ant-design/pro-card';
import { StepsForm } from '@ant-design/pro-components';
import { ProFormInstance } from '@ant-design/pro-form/lib';
import { history } from '@umijs/max';
import { message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';

interface CreateProductModalProps {
    createModalOpen: boolean;
    handleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    // actionRef: React.MutableRefObject<ActionType | undefined>;
    currentRow?: API.Product;
}

export type DataSourceType = {
    id: string;
    price: string;
    stock: string;
    code?: string;
} & API.Sku;

const ProductDetail: React.FC<CreateProductModalProps> = ({}) => {
    const formRef = useRef<ProFormInstance>();
    // const actionRef = useRef<
    //     FormListActionType<{
    //         name: string;
    //     }>
    // >();
    const params = useParams();
    const { id } = params as { id: string };
    const isEdit = id && id !== 'new';
    const [productDetail, setProductDetail] = useState<API.Product>();
    const [baseProps, setBaseProps] = useState<API.Attribute[]>([]);
    const [otherProps, setOtherProps] = useState<API.Attribute[]>([]);
    const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
    const [preForm, setPreForm] = useState<{ productCategoryId?: number; brandId?: number }>({});
    const [baseForm, setBaseForm] = useState<{ name?: string; subTitle?: string; itemNo?: string }>({});
    useEffect(() => {
        if (isEdit) {
            getProductById(id).then((res) => {
                setProductDetail(res.data);
                console.log('[ProductDetail.tsx:] ', res.data);
            });
        }
    }, []);

    // @ts-ignore
    return (
        <>
            <h2>{isEdit ? '编辑商品' : '创建商品'}</h2>
            <br />
            <ProCard>
                <StepsForm formRef={formRef}>
                    <StepsForm.StepForm<{ category: number[]; brandId: number }>
                        layout={'horizontal'}
                        labelCol={{ span: 5 }}
                        name="pre"
                        title="设置分类"
                        onFinish={async () => {
                            const { category, brandId } = formRef.current?.getFieldsValue();
                            const categoryId = category[category.length - 1];
                            const { data: attrList } = await getCategoryAttrs(categoryId);
                            const baseProps = attrList.filter((item: { type: number }) => item.type === 1);
                            const otherProps = attrList.filter((item: { type: number }) => item.type === 2);
                            setBaseProps(baseProps);
                            setOtherProps(otherProps);
                            setPreForm({ productCategoryId: categoryId, brandId });
                            return true;
                        }}
                    >
                        <CategoryStepForm productDetail={productDetail} formRef={formRef} />
                    </StepsForm.StepForm>
                    <StepsForm.StepForm
                        name="base"
                        title="基本信息"
                        layout={'horizontal'}
                        labelCol={{ span: 5 }}
                        onFinish={async () => {
                            setBaseForm({ ...formRef.current?.getFieldsValue() });
                            return true;
                        }}
                    >
                        <BaseInfoStepForm productDetail={productDetail} formRef={formRef} />
                    </StepsForm.StepForm>
                    <StepsForm.StepForm<{
                        originPrice: number;
                        salePrice: number;
                        status: number;
                        stock: number;
                        otherProps: any[];
                    }>
                        style={{ minWidth: 650 }}
                        name="sale"
                        title="销售信息"
                        layout={'horizontal'}
                        labelCol={{ span: 5 }}
                        onFinish={async () => {
                            console.log('[ProductDetail.tsx111:] ', formRef.current?.getFieldsValue());
                            console.log('[dataSource:] ', dataSource);
                            const params: Partial<API.Product> = { ...preForm, ...baseForm };
                            const { originPrice, salePrice, status, stock, otherPropValues } =
                                formRef.current?.getFieldsValue();
                            params.originPrice = originPrice;
                            params.salePrice = salePrice;
                            params.status = status;
                            params.stock = stock;
                            params.skus = dataSource;
                            params.props = [];
                            otherPropValues?.forEach((item: { items: any }, index: number) => {
                                const prop = otherProps[index];
                                params.props?.push({ id: prop.id, name: prop.name, value: item.items });
                            });
                            try {
                                await addProduct(params);
                                message.success('添加成功');
                                history.push('/product/list');
                                return true;
                            } catch (e) {
                                return true;
                            }
                        }}
                    >
                        <SaleStepForm
                            productDetail={productDetail}
                            baseProps={baseProps}
                            formRef={formRef}
                            otherProps={otherProps}
                            dataSource={dataSource}
                            setDataSource={setDataSource}
                        />
                    </StepsForm.StepForm>
                </StepsForm>
            </ProCard>
        </>
    );
};

export default ProductDetail;
