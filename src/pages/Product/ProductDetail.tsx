import BaseInfoStepForm from '@/pages/Product/components/BaseInfoStepForm';
import CategoryStepForm from '@/pages/Product/components/CategoryStepForm';
import SaleStepForm from '@/pages/Product/components/SaleStepForm';
import { addProduct, getCategoryAttrs, getProductById, updateProduct } from '@/services/mall-service/api';
import { history } from '@@/core/history';
import ProCard from '@ant-design/pro-card';
import { StepsForm } from '@ant-design/pro-components';
import { ProFormInstance } from '@ant-design/pro-form/lib';
import { message } from 'antd';
import { UploadFile } from 'antd/es/upload/interface';
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
    props: object;
} & API.Sku;

const ProductDetail: React.FC<CreateProductModalProps> = ({}) => {
    const formRef = useRef<ProFormInstance>();
    const formMapRef = useRef<React.MutableRefObject<ProFormInstance<any> | undefined>[]>([]);
    const params = useParams();
    const { id } = params as { id: string };
    const isEdit = id && id !== 'new';
    const [productDetail, setProductDetail] = useState<API.Product>();
    const [baseProps, setBaseProps] = useState<API.Attribute[]>([]);
    const [otherProps, setOtherProps] = useState<API.Attribute[]>([]);
    const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
    const [preForm, setPreForm] = useState<{ productCategoryId?: number; brandId?: number }>({});
    const [baseForm, setBaseForm] = useState<{ name?: string; subTitle?: string; itemNo?: string }>({});
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    // 编辑器内容
    const [html, setHtml] = useState('');
    const initDataSource = (): DataSourceType[] => {
        return (productDetail?.skus?.map((it) => {
            return {
                id: it.id,
                price: it.price / 100,
                stock: it.stock,
                code: it.code,
                props: it.props,
            };
        }) || []) as DataSourceType[];
    };

    useEffect(() => {
        if (isEdit) {
            getProductById(id).then((res) => {
                res.data.originPrice = res.data.originPrice / 100;
                res.data.salePrice = res.data.salePrice / 100;
                setProductDetail(res.data);
                setFileList(res?.data?.coverUrls?.map((url) => ({ uid: url, url })) as UploadFile[]);
                setHtml(res?.data?.content);
                console.log('[ProductDetail.tsx:] ', res.data);
            });
        }
    }, []);

    useEffect(() => {
        if (productDetail) {
            formMapRef?.current?.forEach((formInstanceRef) => {
                formInstanceRef.current?.setFieldsValue({
                    name: productDetail?.name,
                    subtitle: productDetail?.subtitle,
                    itemNo: productDetail?.itemNo,
                    originPrice: productDetail?.originPrice,
                    salePrice: productDetail?.salePrice,
                    stock: productDetail?.stock,
                    status: productDetail?.status,
                });
            });
        }
    }, [productDetail]);

    // @ts-ignore
    return (
        <>
            <h2>{isEdit ? '编辑商品' : '创建商品'}</h2>
            <br />
            <ProCard>
                <StepsForm formRef={formRef} formMapRef={formMapRef}>
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
                        <BaseInfoStepForm productDetail={productDetail} />
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
                            const params: Partial<API.Product> = { ...preForm, ...baseForm };
                            const { originPrice, salePrice, status, stock, otherPropValues, unit } =
                                formRef.current?.getFieldsValue();
                            params.originPrice = originPrice * 100;
                            params.salePrice = salePrice * 100;
                            params.status = status;
                            params.stock = stock;
                            params.unit = unit;
                            params.skus = (dataSource || []).map((it) => {
                                const initSkus = initDataSource();
                                let initItem;
                                if (initSkus) {
                                    initItem = initSkus.find((item) => {
                                        return (
                                            item.props.length === it.props.length &&
                                            item.props.every((prop) => {
                                                return it.props.find(
                                                    (itProp) =>
                                                        itProp.name === prop.name && itProp.value === prop.value,
                                                );
                                            })
                                        );
                                    });
                                }
                                return {
                                    ...it,
                                    id: initItem ? initItem.id : undefined,
                                    price: it.price * 100,
                                };
                            });
                            params.props = [];
                            if (!fileList || fileList.length === 0) {
                                message.error('请上传商品图片');
                                return false;
                            }
                            params.coverUrls = fileList.map((item) => item.url || '');
                            otherPropValues?.forEach((item: { items: any }, index: number) => {
                                const prop = otherProps[index];
                                params.props?.push({ id: prop.id, name: prop.name, value: item.items });
                            });
                            if (!html) {
                                message.error('请填写商品详情');
                                return false;
                            }
                            params.content = html;
                            try {
                                if (isEdit) {
                                    await updateProduct(productDetail?.id as number, params);
                                    message.success('更新成功');
                                } else {
                                    await addProduct(params);
                                    message.success('添加成功');
                                }
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
                            fileList={fileList}
                            setFileList={setFileList}
                            html={html}
                            setHtml={setHtml}
                            initDataSource={initDataSource}
                        />
                    </StepsForm.StepForm>
                </StepsForm>
            </ProCard>
        </>
    );
};

export default ProductDetail;
