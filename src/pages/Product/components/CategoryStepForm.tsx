import { getBrandById, getBrandList, getCategoryAncestorTree, getCategoryTree } from '@/services/mall-service/api';
import { ProFormCascader, ProFormSelect } from '@ant-design/pro-form/lib';
import React, { useEffect } from 'react';

interface CategoryStepFormProps {
    productDetail?: API.Product;
    formRef: React.MutableRefObject<any>;
}

const CategoryStepForm: React.FC<CategoryStepFormProps> = ({ productDetail, formRef }) => {
    useEffect(() => {
        if (!productDetail?.productCategory?.id) return;
        getCategoryAncestorTree(productDetail?.productCategory?.id).then((res) => {
            let parentIds: number[] = [];
            res.data.forEach((item: { id: number }) => {
                parentIds.push(item.id);
            });
            formRef.current?.setFieldsValue({ category: parentIds });
        });
        getBrandById(productDetail?.brand?.id).then((res) => {
            formRef.current?.setFieldsValue({ brandId: res.data.id });
        });
    }, [productDetail]);

    return (
        <>
            <ProFormCascader
                fieldProps={{ showSearch: true, fieldNames: { label: 'name', value: 'id' } }}
                name="category"
                label="商品分类"
                width={'md'}
                debounceTime={800}
                request={async (params: { keywords: any }) => {
                    const { data } = await getCategoryTree({
                        pageSize: 20,
                        current: 1,
                        name: params?.keywords,
                    });
                    return data;
                }}
                rules={[{ required: true }]}
                params={undefined}
                valueEnum={undefined}
            />
            <ProFormSelect
                fieldProps={{ showSearch: true }}
                name="brandId"
                label="品牌"
                width={'md'}
                debounceTime={800}
                request={async (params: { keywords: any }) => {
                    const { data } = await getBrandList({
                        pageSize: 20,
                        current: 1,
                        name: params?.keywords,
                    });
                    return data.map((item: { name: any; id: any }) => ({
                        label: item.name,
                        value: item.id,
                    }));
                }}
                rules={[{ required: true }]}
                params={undefined}
                valueEnum={undefined}
            />
        </>
    );
};

export default CategoryStepForm;
