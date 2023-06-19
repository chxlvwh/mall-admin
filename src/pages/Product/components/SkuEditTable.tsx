import { ProForm } from '@ant-design/pro-form';
import { EditableProTable } from '@ant-design/pro-table/lib';
import { Button, Form, Space } from 'antd';
import React, { useEffect, useState } from 'react';

interface SkuEditTableProps {
    baseProps: API.Attribute[];
    // eslint-disable-next-line no-unused-vars
    basePropsRule: (index: string | number) => any[];
    dataSource: any[];
    setDataSource: React.Dispatch<React.SetStateAction<any[]>>;
    generateSkus: () => void;
}

const SkuEditTable: React.FC<SkuEditTableProps> = ({
    baseProps,
    basePropsRule,
    dataSource,
    setDataSource,
    generateSkus,
}) => {
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [form] = Form.useForm();

    useEffect(() => {
        setEditableRowKeys(dataSource.map((item) => item.id));
    }, [dataSource]);

    const columns = [
        ...baseProps.map((attr, index) => {
            return {
                title: attr.name,
                formItemProps: {
                    rules: basePropsRule(index),
                },
                editable: false,
                render: (_dom: any, record: any) => {
                    return record.props[index].value;
                },
            };
        }),
        {
            title: '价格',
            dataIndex: 'price',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        whitespace: true,
                        message: '此项是必填项',
                    },
                ],
            },
        },
        {
            title: '库存',
            dataIndex: 'stock',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        whitespace: true,
                        message: '此项是必填项',
                    },
                ],
            },
        },
        {
            title: '商品条形码',
            dataIndex: 'code',
        },
        {
            title: '操作',
            valueType: 'option',
            render: () => {
                return null;
            },
        },
    ];

    return (
        <ProForm.Item name="skus" label={'销售规格'}>
            <EditableProTable
                className={'custom-editable-table'}
                columns={columns}
                rowKey="id"
                fieldProps={{
                    style: {
                        width: '100%',
                        padding: '0',
                    },
                }}
                value={dataSource}
                onChange={setDataSource}
                recordCreatorProps={false}
                editable={{
                    form,
                    type: 'multiple',
                    editableKeys,
                    actionRender: (row: any, config: any, defaultDoms: { delete: any }) => {
                        return [defaultDoms.delete];
                    },
                    onValuesChange: (record: any, recordList: any) => {
                        setDataSource(recordList);
                    },
                    onChange: setEditableRowKeys,
                }}
            />
            <Space>
                <Button type={'primary'} onClick={() => generateSkus()}>
                    刷新列表
                </Button>
                <Button
                    type={'primary'}
                    onClick={() => {
                        const newDataSource = [...dataSource];
                        newDataSource.forEach((item, index) => {
                            item.price = newDataSource[0].price;
                            form.setFieldsValue({
                                [index]: { ...form.getFieldsValue()[index], price: newDataSource[0].price },
                            });
                        });
                        setDataSource(newDataSource);
                    }}
                >
                    同步价格
                </Button>
                <Button
                    type={'primary'}
                    onClick={() => {
                        const newDataSource = [...dataSource];
                        newDataSource.forEach((item, index) => {
                            item.stock = newDataSource[0].stock;
                            form.setFieldsValue({
                                [index]: { ...form.getFieldsValue()[index], stock: newDataSource[0].stock },
                            });
                        });
                        setDataSource(newDataSource);
                    }}
                >
                    同步库存
                </Button>
            </Space>
        </ProForm.Item>
    );
};

export default SkuEditTable;
