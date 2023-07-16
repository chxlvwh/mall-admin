import { getCategoryTree } from '@/services/mall-service/api';
import { ProForm } from '@ant-design/pro-form';
import { ProFormCascader } from '@ant-design/pro-form/lib';
import { Button, FormInstance, Space, Table } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { DefaultOptionType } from 'rc-select/es/Select';
import React, { useEffect, useState } from 'react';
import { Add_Category } from './CreateCouponModal';

interface CouponCategoriesProps {
    selectedCategories: Add_Category[];
    setSelectedCategories: React.Dispatch<React.SetStateAction<Add_Category[]>>;
    form: FormInstance;
}
const CouponCategories: React.FC<CouponCategoriesProps> = ({ form, selectedCategories, setSelectedCategories }) => {
    const [tempSelectedCategory, setTempSelectedCategory] = useState<Add_Category>();
    useEffect(() => {
        setTempSelectedCategory(undefined);
    }, [selectedCategories]);
    const addCategory = () => {
        // if (!selectOptions) return;
        const nextSelectedCategories = [...selectedCategories];
        // const category = selectOptions[selectOptions.length - 1];
        if (
            tempSelectedCategory &&
            !nextSelectedCategories.find((item) => item.value === tempSelectedCategory?.value)
        ) {
            nextSelectedCategories.push(tempSelectedCategory);
            setSelectedCategories(nextSelectedCategories);
            form.resetFields(['category']);
        }
    };
    const removeCategory = (value: string | number) => {
        const nextSelectedCategories = selectedCategories.filter((item) => item.value !== value);
        setSelectedCategories(nextSelectedCategories);
    };
    return (
        <>
            <ProForm.Group>
                <ProFormCascader
                    fieldProps={{
                        changeOnSelect: true,
                        showSearch: true,
                        onChange: (value: CheckboxValueType[], selectedOptions: DefaultOptionType[]) => {
                            if (!selectedOptions) return;
                            const parent = selectedOptions.length > 1 ? selectedOptions[0] : undefined;
                            const category = selectedOptions[selectedOptions.length - 1];
                            setTempSelectedCategory({
                                value: category.value as string | number,
                                label: `${parent ? parent.label + '>' : ''}${category.label}`,
                            });
                        },
                    }}
                    name="category"
                    colon={false}
                    labelCol={{ span: 11 }}
                    placeholder="商品分类"
                    label={' '}
                    width={'md'}
                    debounceTime={800}
                    request={async (params: { keywords: any }) => {
                        const { data } = await getCategoryTree({
                            pageSize: 20,
                            current: 1,
                            name: params?.keywords,
                        });
                        return data.map((it) => ({
                            label: it.name,
                            value: it.id,
                            children: (it.children || []).map((item) => ({ label: item.name, value: item.id })),
                        }));
                    }}
                    params={undefined}
                    valueEnum={undefined}
                />
                <Button type="primary" onClick={addCategory}>
                    添加
                </Button>
            </ProForm.Group>
            <Table<Add_Category>
                rowKey="value"
                columns={[
                    {
                        title: '编号',
                        dataIndex: 'value',
                    },
                    {
                        title: '分类名称',
                        dataIndex: 'label',
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        render: (_: any, record: Add_Category) => {
                            return (
                                <Space>
                                    <Button
                                        type={'link'}
                                        onClick={async (event) => {
                                            event.preventDefault();
                                            removeCategory(record.value);
                                        }}
                                    >
                                        删除
                                    </Button>
                                </Space>
                            );
                        },
                    },
                ]}
                dataSource={selectedCategories}
                pagination={false}
                size="small"
            ></Table>
        </>
    );
};

export default CouponCategories;
