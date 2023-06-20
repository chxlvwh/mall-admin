import { ProFormText } from '@ant-design/pro-form/lib';
import React from 'react';

interface BaseInfoStepFormProps {
    productDetail?: API.Product;
}

const BaseInfoStepForm: React.FC<BaseInfoStepFormProps> = ({ productDetail }) => {
    return (
        <>
            <ProFormText
                required
                initialValue={productDetail?.name}
                name="name"
                label="商品名称"
                width={'xl'}
                placeholder={'最多30个字'}
                fieldProps={{ maxLength: 30 }}
                rules={[{ required: true }]}
            />
            <ProFormText
                initialValue={productDetail?.subtitle}
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
