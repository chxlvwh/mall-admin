import { ProForm } from '@ant-design/pro-form';
import { EditableProTable } from '@ant-design/pro-table/lib';
import React, { useEffect, useState } from 'react';

interface SkuEditTableProps {
    baseProps: API.Attribute[];
    // eslint-disable-next-line no-unused-vars
    basePropsRule: (index: string | number) => any[];
    dataSource: any[];
    setDataSource: React.Dispatch<React.SetStateAction<any[]>>;
}

const SkuEditTable: React.FC<SkuEditTableProps> = ({ baseProps, basePropsRule, dataSource, setDataSource }) => {
    console.log(
        '[dataSource.map((item) => item.id):] ',
        dataSource.map((item) => item.id),
    );
    console.log('[datasrouce:] ', dataSource);
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

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
    console.log('[editableKeys:] ', editableKeys);

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
        </ProForm.Item>
    );
};

export default SkuEditTable;
