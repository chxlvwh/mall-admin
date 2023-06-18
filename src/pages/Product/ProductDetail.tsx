import { getBrandList, getCategoryAttrs, getCategoryTree, getProductById } from '@/services/mall-service/api';
import ProCard from '@ant-design/pro-card';
import { ActionType, ProFormRadio, ProFormText, StepsForm } from '@ant-design/pro-components';
import { ProFormField } from '@ant-design/pro-form';
import {
    ProForm,
    ProFormCascader,
    ProFormDigit,
    ProFormGroup,
    ProFormInstance,
    ProFormList,
    ProFormSelect,
} from '@ant-design/pro-form/lib';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';

interface CreateProductModalProps {
    createModalOpen: boolean;
    handleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    actionRef: React.MutableRefObject<ActionType | undefined>;
    currentRow?: API.Product;
}
const ProductDetail: React.FC<CreateProductModalProps> = ({}) => {
    const formRef = useRef<ProFormInstance>();
    const params = useParams();
    const { id } = params as { id: string };
    const isEdit = id && id !== 'new';
    const [productDetail, setProductDetail] = useState<API.Product>();
    const [baseProps, setBaseProps] = useState<API.Attribute[]>([]);
    const [otherProps, setOtherProps] = useState<API.Attribute[]>([]);
    useEffect(() => {
        if (isEdit) {
            getProductById(id).then((res) => {
                setProductDetail(res.data);
                console.log('[ProductDetail.tsx:] ', res.data);
            });
        }
    }, []);
    return (
        <>
            <h2>{isEdit ? '编辑商品' : '创建商品'}</h2>
            <br />
            <ProCard>
                <StepsForm formRef={formRef}>
                    <StepsForm.StepForm
                        layout={'horizontal'}
                        labelCol={{ span: 5 }}
                        name="pre"
                        title="设置分类"
                        onFinish={async () => {
                            const { category } = formRef.current?.getFieldsValue();
                            const categoryId = category[category.length - 1];
                            const { data: attrList } = await getCategoryAttrs(categoryId);
                            const baseProps = attrList.filter((item) => item.type === 1);
                            const otherProps = attrList.filter((item) => item.type === 2);
                            setBaseProps(baseProps);
                            setOtherProps(otherProps);
                            return true;
                        }}
                    >
                        <ProFormCascader
                            initialValue={productDetail?.productCategory?.name}
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
                                return data.map((item) => ({ label: item.name, value: item.id }));
                            }}
                            rules={[{ required: true }]}
                            params={undefined}
                            valueEnum={undefined}
                        />
                    </StepsForm.StepForm>
                    <StepsForm.StepForm name="base" title="基本信息" layout={'horizontal'} labelCol={{ span: 5 }}>
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
                        <ProFormText
                            initialValue={productDetail?.itemNo}
                            label={'商品货号'}
                            name="itemNo"
                            width={'md'}
                        />
                    </StepsForm.StepForm>
                    <StepsForm.StepForm
                        style={{ minWidth: 650 }}
                        name="sale"
                        title="销售信息"
                        layout={'horizontal'}
                        labelCol={{ span: 5 }}
                        onFinish={async () => {
                            console.log('[ProductDetail.tsx111:] ', formRef.current?.getFieldsValue());
                        }}
                    >
                        <ProFormDigit
                            required
                            initialValue={productDetail?.originPrice}
                            label={'商品原价'}
                            name="originPrice"
                            width={'sm'}
                            min={0.01}
                            fieldProps={{ precision: 2, prefix: '￥' }}
                        />
                        <ProFormDigit
                            required
                            initialValue={productDetail?.stock || 0}
                            label={'总数量'}
                            name="stock"
                            width={'sm'}
                            fieldProps={{ precision: 0 }}
                        />
                        <ProForm.Item name="baseProps" label={'基本属性'}>
                            {baseProps.map((item, index) => {
                                return (
                                    <ProFormGroup
                                        key={item.id}
                                        style={{
                                            width: '550px',
                                            background: '#f8f9fc',
                                            padding: '10px',
                                            border: '1px solid #ebeef5',
                                        }}
                                    >
                                        {item.entryMethod === 1 && (
                                            <ProFormList
                                                name={['baseProps', index, 'items']}
                                                label={item.name}
                                                creatorButtonProps={{
                                                    creatorButtonText: '新增规格项',
                                                    icon: false,
                                                    type: 'link',
                                                    style: { width: 'unset' },
                                                }}
                                                min={1}
                                                copyIconProps={false}
                                                deleteIconProps={{ tooltipText: '删除' }}
                                                itemRender={({ listDom, action }) => (
                                                    <div
                                                        style={{
                                                            display: 'inline-flex',
                                                            marginInlineEnd: 25,
                                                        }}
                                                    >
                                                        {listDom}
                                                        {action}
                                                    </div>
                                                )}
                                            >
                                                <ProFormText
                                                    key={Math.random()}
                                                    name={Math.random()}
                                                    allowClear={false}
                                                    width="xs"
                                                />
                                            </ProFormList>
                                        )}
                                        {item.entryMethod === 2 && item.value && (
                                            <ProFormList
                                                name={['baseProps', index, 'items']}
                                                label={item.name}
                                                creatorButtonProps={{
                                                    creatorButtonText: '新增规格项',
                                                    icon: false,
                                                    type: 'link',
                                                    style: { width: 'unset' },
                                                }}
                                                min={1}
                                                max={item.value.split(',').length}
                                                copyIconProps={false}
                                                deleteIconProps={{ tooltipText: '删除' }}
                                                itemRender={({ listDom, action }) => (
                                                    <div
                                                        style={{
                                                            display: 'inline-flex',
                                                            marginInlineEnd: 25,
                                                        }}
                                                    >
                                                        {listDom}
                                                        {action}
                                                    </div>
                                                )}
                                            >
                                                <ProFormSelect
                                                    name={['propValue']}
                                                    width={'xs'}
                                                    options={item.value
                                                        .split(',')
                                                        .map((it) => ({ label: it, value: it }))}
                                                    params={undefined}
                                                    request={undefined}
                                                    debounceTime={undefined}
                                                    valueEnum={undefined}
                                                ></ProFormSelect>
                                            </ProFormList>
                                        )}
                                    </ProFormGroup>
                                );
                            })}
                        </ProForm.Item>
                        <ProFormField
                            name="otherProps"
                            label={'其他属性'}
                            style={{
                                background: '#f8f9fc',
                                padding: '10px',
                                // borderRadius: '5px',
                                border: '1px solid #ebeef5',
                            }}
                        >
                            <ProFormGroup
                                style={{
                                    background: '#f8f9fc',
                                    padding: '10px',
                                    // borderRadius: '5px',
                                    border: '1px solid #ebeef5',
                                }}
                            >
                                {otherProps.map((item) => {
                                    return (
                                        <div key={item.id}>
                                            {item.entryMethod === 1 && (
                                                <ProFormText
                                                    style={{ marginBottom: '32px' }}
                                                    label={item.name}
                                                    width={150}
                                                ></ProFormText>
                                            )}
                                            {item.entryMethod === 2 && item.value && (
                                                <ProFormSelect
                                                    label={item.name}
                                                    width={150}
                                                    options={item.value
                                                        .split(',')
                                                        .map((it, index) => ({ label: it, value: index }))}
                                                    params={undefined}
                                                    request={undefined}
                                                    debounceTime={undefined}
                                                    valueEnum={undefined}
                                                ></ProFormSelect>
                                            )}
                                        </div>
                                    );
                                })}
                            </ProFormGroup>
                        </ProFormField>

                        <ProFormRadio.Group
                            required
                            initialValue={productDetail?.status === 0 ? 0 : 1}
                            name="status"
                            label="上架状态"
                            options={[
                                {
                                    label: '立即上架',
                                    value: 1,
                                },
                                {
                                    label: '暂不上架',
                                    value: 0,
                                },
                            ]}
                            params={undefined}
                            request={undefined}
                            debounceTime={undefined}
                            valueEnum={undefined}
                        />
                    </StepsForm.StepForm>
                </StepsForm>
            </ProCard>
        </>
    );
};

export default ProductDetail;
