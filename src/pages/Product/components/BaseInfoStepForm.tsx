import { ProFormText } from '@ant-design/pro-form/lib';
import React, { useEffect } from 'react';

interface BaseInfoStepFormProps {
    productDetail?: API.Product;
    formRef: React.MutableRefObject<any>;
}

const BaseInfoStepForm: React.FC<BaseInfoStepFormProps> = ({ productDetail, formRef }) => {
    useEffect(() => {
        formRef.current?.setFieldsValue({
            name: productDetail?.name,
            subtitle: productDetail?.subtitle,
            itemNo: productDetail?.itemNo,
        });
    });
    return (
        <>
            <ProFormText
                required
                name="name"
                label="商品名称"
                width={'xl'}
                placeholder={'最多30个字'}
                fieldProps={{ maxLength: 30 }}
                rules={[{ required: true }]}
            />
            <ProFormText
                name="subtitle"
                label="副标题"
                width={'xl'}
                placeholder={'最多30个字'}
                fieldProps={{ maxLength: 30 }}
            />
            <ProFormText initialValue={productDetail?.itemNo} label={'商品货号'} name="itemNo" width={'md'} />
        </>
    );
};

export default BaseInfoStepForm;
