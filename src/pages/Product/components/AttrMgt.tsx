import { getAttrList, updateCategoryAttr } from '@/services/mall-service/api';
import { ActionType, ProForm } from '@ant-design/pro-components';
import { DrawerForm } from '@ant-design/pro-form';
import { ProFormSelect } from '@ant-design/pro-form/lib';
import React from 'react';

interface AttrMgtProps {
    drawerVisit: boolean;
    currentRow?: API.Category;
    setDrawerVisit: React.Dispatch<React.SetStateAction<boolean>>;
    actionRef: React.MutableRefObject<ActionType | undefined>;
}

const AttrMgt: React.FC<AttrMgtProps> = ({ drawerVisit, setDrawerVisit, currentRow, actionRef }) => {
    return (
        <>
            <DrawerForm
                drawerProps={{ destroyOnClose: true }}
                onOpenChange={setDrawerVisit}
                title={`属性配置 (${currentRow?.name})`}
                open={drawerVisit}
                onFinish={async (value) => {
                    await updateCategoryAttr(currentRow?.id as number, {
                        attributeIds: [...value.baseType, ...value.extendType],
                    });
                    actionRef.current?.reload();
                    return true;
                }}
            >
                <ProForm.Group>
                    <ProFormSelect
                        fieldProps={{
                            showSearch: true,
                            mode: 'multiple',
                        }}
                        initialValue={currentRow?.productAttributes?.filter((it) => it.type === 1).map((it) => it.id)}
                        label="基本属性"
                        width={'md'}
                        debounceTime={500}
                        name="baseType"
                        request={async (params: { keyWords: any }) => {
                            const { data: list } = await getAttrList({
                                current: 1,
                                pageSize: 100,
                                type: 1,
                                name: params.keyWords,
                            });
                            return list.map((it) => ({ label: it.name, value: it.id }));
                        }}
                        params={undefined}
                        valueEnum={undefined}
                    ></ProFormSelect>
                    <ProFormSelect
                        debounceTime={500}
                        fieldProps={{ showSearch: true, optionFilterProp: 'name', mode: 'multiple' }}
                        initialValue={currentRow?.productAttributes?.filter((it) => it.type === 2).map((it) => it.id)}
                        label="其他属性"
                        width={'md'}
                        name="extendType"
                        request={async (params: { keyWords: any }) => {
                            const { data: list } = await getAttrList({
                                current: 1,
                                pageSize: 100,
                                type: 2,
                                name: params.keyWords,
                            });
                            return list.map((it) => ({ label: it.name, value: it.id }));
                        }}
                        params={undefined}
                        valueEnum={undefined}
                    ></ProFormSelect>
                </ProForm.Group>
            </DrawerForm>
        </>
    );
};

export default AttrMgt;
