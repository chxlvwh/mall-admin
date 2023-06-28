import RichTextEditor from '@/pages/Product/components/RichTextEditor';
import SkuEditTable from '@/pages/Product/components/SkuEditTable';
import { DataSourceType } from '@/pages/Product/ProductDetail';
import { ProFormRadio } from '@ant-design/pro-components';
import { ProFormField } from '@ant-design/pro-form';
import { ProForm, ProFormDigit, ProFormGroup, ProFormList, ProFormSelect, ProFormText } from '@ant-design/pro-form/lib';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { RcFile } from 'antd/lib/upload';
import React, { useEffect, useState } from 'react';

interface SaleStepFormProps {
    productDetail?: API.Product;
    baseProps: API.Attribute[];
    setDataSource: React.Dispatch<React.SetStateAction<any[]>>;
    formRef: React.MutableRefObject<any>;
    otherProps: API.Attribute[];
    dataSource: DataSourceType[];
    fileList: UploadFile[];
    setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>;
    html: string;
    setHtml: React.Dispatch<React.SetStateAction<string>>;
}

const SaleStepForm: React.FC<SaleStepFormProps> = ({
    productDetail,
    baseProps,
    dataSource,
    setDataSource,
    formRef,
    otherProps,
    fileList,
    setFileList,
    html,
    setHtml,
}) => {
    const [initBasePropsMap, setInitBasePropsMap] = useState<{ [key: string]: string[] }>({});
    const initDataSource = () => {
        return (
            productDetail?.skus?.map((it, index) => {
                return {
                    id: index,
                    price: it.price,
                    stock: it.stock,
                    code: it.code,
                    props: it.props,
                };
            }) || []
        );
    };

    const initBaseProps = () => {
        const skus = initDataSource();
        const skuProps = skus.map((it) => it.props);
        let basePropsMap: { [key: string]: string[] } = {};
        skuProps.forEach((item) => {
            item.forEach((it: { name: string; value: string }) => {
                if (basePropsMap[it.name] && basePropsMap[it.name].indexOf(it.value) === -1) {
                    basePropsMap[it.name].push(it.value);
                } else if (!basePropsMap[it.name]) {
                    basePropsMap[it.name] = [it.value];
                }
            });
        });
        setInitBasePropsMap(basePropsMap);
    };
    useEffect(() => {
        setTimeout(() => {
            initBaseProps();
            setDataSource(initDataSource());
        });
    }, [productDetail]);
    useEffect(() => {
        setTimeout(() => {
            formRef.current?.setFieldsValue({
                originPrice: productDetail?.originPrice,
                salePrice: productDetail?.salePrice,
                stock: productDetail?.stock,
                status: productDetail?.status,
            });
        });
    });

    const generateSkus = () => {
        let result: any[] = [];
        const basePropValues = formRef.current?.getFieldValue('baseProps');
        basePropValues?.forEach((it: { items: { propValue: string }[] }, index: number) => {
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
                                const props = newResult[i].props.filter(
                                    (it: { name: string }) => it.name !== baseProps[index].name,
                                );
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
        console.log('[skus:] ', result);
        setDataSource(result);
    };

    const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList.map((it) => ({ uid: it.uid, name: it.name, url: it.url || it.response?.data?.url })));
    };

    const onPreview = async (file: UploadFile) => {
        // window.open(file.url);
        let src = file.url as string;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as RcFile);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };
    const basePropsRule = (index: string | number) => {
        return [
            {
                required: true,
                validator: async (_: any, value?: string | any[]) => {
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
    return (
        <>
            <ProFormDigit
                required
                label={'商品原价'}
                name="originPrice"
                width={'sm'}
                min={0.01}
                fieldProps={{ precision: 2, prefix: '￥' }}
            />
            <ProFormDigit
                required
                label={'销售价'}
                name="salePrice"
                width={'sm'}
                min={0.01}
                fieldProps={{ precision: 2, prefix: '￥' }}
            />
            <ProFormDigit required label={'总数量'} name="stock" width={'sm'} fieldProps={{ precision: 0 }} />
            {baseProps.length ? (
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
                                        // actionRef={actionRef}
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
                                        initialValue={initBasePropsMap[item.name].map((it) => ({ propValue: it }))}
                                    >
                                        <ProFormText
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
                                        initialValue={initBasePropsMap[item.name].map((it) => ({ propValue: it }))}
                                    >
                                        <ProFormSelect
                                            name={['propValue']}
                                            width={'xs'}
                                            options={item.value.split(',').map((it: any) => ({
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
            ) : null}
            {baseProps.length ? (
                <SkuEditTable
                    baseProps={baseProps}
                    basePropsRule={basePropsRule}
                    dataSource={dataSource}
                    setDataSource={setDataSource}
                    generateSkus={generateSkus}
                />
            ) : null}
            {otherProps.length ? (
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
                        {otherProps.map((item, index) => {
                            return (
                                <div key={item.id}>
                                    {item.entryMethod === 1 && (
                                        <ProFormText
                                            name={['otherPropValues', index, 'items']}
                                            style={{ marginBottom: '32px' }}
                                            label={item.name}
                                            width={150}
                                        ></ProFormText>
                                    )}
                                    {item.entryMethod === 2 && item.value && (
                                        <ProFormSelect
                                            name={['otherPropValues', index, 'items']}
                                            label={item.name}
                                            width={150}
                                            options={item.value
                                                .split(',')
                                                .map((it: string) => ({ label: it, value: it }))}
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
            ) : null}
            <ProFormField label={'上传主图'} required>
                <ImgCrop rotationSlider>
                    <Upload
                        action="/api/v1/upload"
                        listType="picture-card"
                        fileList={fileList}
                        onChange={onChange}
                        onPreview={onPreview}
                    >
                        {fileList.length < 5 && '+ Upload'}
                    </Upload>
                </ImgCrop>
            </ProFormField>
            <ProFormField label={'上传商品内容'} required>
                <RichTextEditor html={html} setHtml={setHtml} />
            </ProFormField>
            <ProFormRadio.Group
                required
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
        </>
    );
};

export default SaleStepForm;
