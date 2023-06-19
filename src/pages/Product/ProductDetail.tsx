import SkuEditTable from '@/pages/Product/components/SkuEditTable';
import { getBrandList, getCategoryAttrs, getCategoryTree, getProductById } from '@/services/mall-service/api';
import ProCard from '@ant-design/pro-card';
import { ActionType, ProFormRadio, StepsForm } from '@ant-design/pro-components';
import { ProFormField } from '@ant-design/pro-form';
import {
    FormListActionType,
    ProForm,
    ProFormCascader,
    ProFormDigit,
    ProFormGroup,
    ProFormInstance,
    ProFormList,
    ProFormSelect,
    ProFormText,
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
    const actionRef = useRef<
        FormListActionType<{
            name: string;
        }>
    >();
    const params = useParams();
    const { id } = params as { id: string };
    const isEdit = id && id !== 'new';
    const [productDetail, setProductDetail] = useState<API.Product>();
    const [baseProps, setBaseProps] = useState<API.Attribute[]>([]);
    const [otherProps, setOtherProps] = useState<API.Attribute[]>([]);
    const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
    useEffect(() => {
        if (isEdit) {
            getProductById(id).then((res) => {
                setProductDetail(res.data);
                console.log('[ProductDetail.tsx:] ', res.data);
            });
        }
    }, []);

    type AttrNameKeys = keyof (typeof baseProps)[number]['name'];

    type DataSourceType = {
        id: string;
        price: string;
        stock: string;
        code?: string;
        children?: DataSourceType[];
    } & {
        // eslint-disable-next-line no-unused-vars
        [K in AttrNameKeys]: string;
    };

    const generateSkus = () => {
        let result: any[] = [];
        const basePropValues = formRef.current?.getFieldValue('baseProps');
        basePropValues.forEach((it: { items: { propValue: string }[] }, index: number) => {
            if (it.items) {
                let newResult: any[] = [];

                it.items.forEach((item: { propValue: string }, idx: number) => {
                    if (index === 0) {
                        result.push({ props: [{ name: baseProps[index].name, value: item.propValue }] });
                        newResult = [...result];
                    } else {
                        if (idx === 0) {
                            result.forEach((it: any) => {
                                it.props.push({ name: baseProps[index].name, value: item.propValue });
                            });
                            newResult = [...result];
                        } else {
                            for (let i = 0; i < newResult.length; i++) {
                                const props = newResult[i].props.filter((it) => it.name !== baseProps[index].name);
                                const newItem = { ...newResult[i] };
                                newItem.props = props.concat({ name: baseProps[index].name, value: item.propValue });
                                result.push(newItem);
                            }
                        }
                    }
                });
            }
        });
        result.forEach((item, index) => {
            item['id'] = index.toString();
            item['price'] = '';
            item['stock'] = 0;
            item['code'] = '';
        });
        console.log('[result:] ', result);
        setDataSource(result);
    };

    const basePropsRule = (index: string | number) => {
        return [
            {
                required: true,
                validator: async (_: any, value?: string | any[]) => {
                    console.log(value);
                    if (value && value.length > 0) {
                        return;
                    }
                    throw new Error('不能为空');
                },
            },
            {
                validator: async (_: any, value?: string) => {
                    const selectedValue = formRef.current
                        ?.getFieldValue('baseProps')
                        ?.[index]?.items?.map((it: { propValue: string }) => it.propValue);

                    if (selectedValue?.filter((it: string) => it?.trim() === value?.trim()).length <= 1) {
                        return;
                    }
                    throw new Error('与其他项重复');
                },
            },
        ];
    };

    // @ts-ignore
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
                            const baseProps = attrList.filter((item: { type: number }) => item.type === 1);
                            const otherProps = attrList.filter((item: { type: number }) => item.type === 2);
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
                                return data.map((item: { name: any; id: any }) => ({
                                    label: item.name,
                                    value: item.id,
                                }));
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
                            console.log('[dataSource:] ', dataSource);
                            console.log(
                                '[ProductDetail.tsx:] ',
                                formRef.current?.getFieldValue('baseProps')?.[1]?.items,
                            );
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
                                            width: '35rem',
                                            background: '#f8f9fc',
                                            padding: '10px',
                                            border: '1px solid #ebeef5',
                                        }}
                                    >
                                        {item.entryMethod === 1 && (
                                            <ProFormList
                                                actionRef={actionRef}
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
                                                initialValue={[{ propValue: '' }]}
                                            >
                                                <ProFormText
                                                    fieldProps={{
                                                        onChange: generateSkus,
                                                    }}
                                                    name={['propValue']}
                                                    allowClear={false}
                                                    width="xs"
                                                    rules={basePropsRule(index)}
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
                                                initialValue={[{ propValue: '' }]}
                                            >
                                                <ProFormSelect
                                                    fieldProps={{
                                                        onChange: generateSkus,
                                                    }}
                                                    name={['propValue']}
                                                    width={'xs'}
                                                    options={item.value.split(',').map((it) => ({
                                                        label: it,
                                                        value: it,
                                                    }))}
                                                    params={undefined}
                                                    request={undefined}
                                                    debounceTime={undefined}
                                                    valueEnum={undefined}
                                                    rules={basePropsRule(index)}
                                                ></ProFormSelect>
                                            </ProFormList>
                                        )}
                                    </ProFormGroup>
                                );
                            })}
                        </ProForm.Item>
                        <SkuEditTable
                            baseProps={baseProps}
                            basePropsRule={basePropsRule}
                            dataSource={dataSource}
                            setDataSource={setDataSource}
                        />
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
