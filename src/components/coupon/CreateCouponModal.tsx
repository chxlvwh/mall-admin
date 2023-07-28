import CouponCategories from '@/components/coupon/CouponCategories';
import CouponProducts from '@/components/coupon/CouponProducts';
import { addCoupon, updateCoupon } from '@/services/mall-service/api';
import { ActionType, ModalForm, ProFormRadio, ProFormText } from '@ant-design/pro-components';
import { ProFormDateTimeRangePicker } from '@ant-design/pro-form';
import { ProFormDigit, ProFormSelect } from '@ant-design/pro-form/lib';
import { Form, message } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

interface CreateCouponModalProps {
    createModalOpen: boolean;
    handleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    actionRef: React.MutableRefObject<ActionType | undefined>;
    currentRow?: API.Coupon;
}

export type Add_Product = {
    key: string | number;
    label: string | number;
};

export type Add_Category = {
    label: string;
    value: string | number;
};

const CreateCouponModal = ({ createModalOpen, handleModalOpen, actionRef, currentRow }: CreateCouponModalProps) => {
    const [form] = Form.useForm();
    const isEdit = currentRow && !!currentRow.id;
    const [currentScope, setCurrentScope] = useState('ALL');
    const [selectedProducts, setSelectedProducts] = useState<Add_Product[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<Add_Category[]>([]);

    useEffect(() => {
        if (createModalOpen) {
            setCurrentScope('ALL');
            setSelectedProducts([]);
            setSelectedCategories([]);
            if (isEdit) {
                setCurrentScope(currentRow?.scope || 'ALL');
                setSelectedProducts(currentRow?.products.map((it) => ({ key: it.id, label: it.name })) || []);
                setSelectedCategories(
                    currentRow?.categories.map((it) => ({
                        label: `${it.parent ? it.parent.name + '>' : ''}${it.name}`,
                        value: it.id,
                    })) || [],
                );
            }
        }
    }, [createModalOpen]);

    const handleAdd = async (fields: API.Coupon & { validPeriod: Date[] }) => {
        const { threshold, value, validPeriod, scope } = fields;
        const hide = message.loading('正在添加');
        try {
            await addCoupon({
                ...fields,
                threshold: threshold * 100,
                value: value * 100,
                startDate: validPeriod[0],
                endDate: validPeriod[1],
                productIds: scope === 'PRODUCT' ? selectedProducts.map((it) => it.key as number) : [],
                categoryIds: scope === 'CATEGORY' ? selectedCategories.map((it) => it.value as number) : [],
            });
            hide();
            message.success('添加成功');
            return true;
        } catch (error) {
            hide();
            return false;
        }
    };

    const handleUpdate = async (id: number, fields: API.Coupon & { validPeriod: Date[] }) => {
        console.log('[CreateUserModal.tsx:] ', fields);
        const hide = message.loading('正在更新');
        const { validPeriod, scope } = fields;
        try {
            await updateCoupon(id, {
                startDate: validPeriod[0],
                endDate: validPeriod[1],
                productIds: scope === 'PRODUCT' ? selectedProducts.map((it) => it.key as number) : [],
                categoryIds: scope === 'CATEGORY' ? selectedCategories.map((it) => it.value as number) : [],
            });
            hide();
            message.success('更新成功');
            return true;
        } catch (error) {
            hide();
            return false;
        }
    };

    return (
        <ModalForm
            form={form}
            layout={'horizontal'}
            labelCol={{ span: 5 }}
            title={isEdit ? '更新优惠券' : '创建优惠券'}
            modalProps={{ destroyOnClose: true }}
            open={createModalOpen}
            onOpenChange={handleModalOpen}
            onFinish={async (value) => {
                console.log('[CreateCouponModal.tsx:] ', value);
                let successed = false;
                if (!isEdit) {
                    successed = await handleAdd(value as API.Coupon & { validPeriod: Date[] });
                } else {
                    successed = await handleUpdate(currentRow.id, value as API.Coupon & { validPeriod: Date[] });
                }
                if (successed) {
                    handleModalOpen(false);
                    if (actionRef.current) {
                        actionRef.current.reload();
                    }
                }
            }}
        >
            <ProFormText
                disabled={isEdit}
                initialValue={currentRow?.name}
                label="优惠券名称"
                rules={[
                    {
                        required: true,
                        message: '优惠券名称不能为空',
                    },
                ]}
                width="md"
                name="name"
            />
            <ProFormSelect
                disabled={isEdit}
                initialValue={currentRow?.type || 'DISCOUNT_AMOUNT'}
                allowClear={false}
                label="优惠券类型"
                width="md"
                name="type"
                options={[
                    {
                        label: '满减优惠',
                        value: 'DISCOUNT_AMOUNT',
                    },
                ]}
                params={undefined}
                debounceTime={undefined}
                request={undefined}
                valueEnum={undefined}
            ></ProFormSelect>
            <ProFormDigit
                disabled={isEdit}
                initialValue={currentRow?.threshold ? currentRow.threshold / 100 : undefined}
                label="使用门槛"
                fieldProps={{ addonBefore: '满', addonAfter: '元可用', precision: 0 }}
                width="md"
                name="threshold"
                rules={[
                    {
                        required: true,
                        message: '使用门槛不能为空',
                    },
                ]}
            ></ProFormDigit>
            <ProFormDigit
                disabled={isEdit}
                initialValue={currentRow?.value ? currentRow.value / 100 : undefined}
                label="优惠金额"
                fieldProps={{ addonAfter: '元', precision: 0 }}
                width="sm"
                name="value"
                rules={[
                    {
                        required: true,
                        message: '优惠金额不能为空',
                    },
                ]}
            ></ProFormDigit>
            <ProFormDateTimeRangePicker
                initialValue={[currentRow?.startDate, currentRow?.endDate]}
                label="有效期"
                width="md"
                name="validPeriod"
                rules={[
                    {
                        required: true,
                        message: '有效期不能为空',
                    },
                ]}
                fieldProps={{
                    showTime: {
                        defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
                    },
                }}
            ></ProFormDateTimeRangePicker>
            {/*发放总量*/}
            <ProFormDigit
                disabled={isEdit}
                initialValue={currentRow?.quantity}
                label="优惠券数量"
                fieldProps={{ precision: 0, addonAfter: '张' }}
                width="sm"
                max={1000000}
                name="quantity"
                rules={[
                    {
                        required: true,
                        message: '优惠券数量不能为空',
                    },
                ]}
            ></ProFormDigit>
            {/*优惠券每人限领数量*/}
            <ProFormSelect
                disabled={isEdit}
                initialValue={currentRow?.quantityPerUser || 1}
                allowClear={false}
                label="每人限领张数"
                width="sm"
                name="quantityPerUser"
                options={[
                    {
                        label: '1',
                        value: 1,
                    },
                    {
                        label: '2',
                        value: 2,
                    },
                    {
                        label: '3',
                        value: 3,
                    },
                    {
                        label: '4',
                        value: 4,
                    },
                    {
                        label: '5',
                        value: 5,
                    },
                    {
                        label: '无限制',
                        value: 0,
                    },
                ]}
                params={undefined}
                debounceTime={undefined}
                request={undefined}
                valueEnum={undefined}
            ></ProFormSelect>
            {/*优惠券使用范围*/}
            <ProFormRadio.Group
                disabled={isEdit}
                initialValue={currentRow?.scope || 'ALL'}
                radioType={'button'}
                fieldProps={{
                    onChange: (e) => {
                        setCurrentScope(e.target.value);
                    },
                }}
                label="优惠券使用范围"
                width="md"
                name="scope"
                options={[
                    {
                        label: '全场通用',
                        value: 'ALL',
                    },
                    {
                        label: '指定分类可用',
                        value: 'CATEGORY',
                    },
                    {
                        label: '指定商品可用',
                        value: 'PRODUCT',
                    },
                ]}
                params={undefined}
                debounceTime={undefined}
                request={undefined}
                valueEnum={undefined}
            ></ProFormRadio.Group>
            {currentScope === 'PRODUCT' && (
                <CouponProducts
                    selectedProducts={selectedProducts}
                    setSelectedProducts={setSelectedProducts}
                    form={form}
                />
            )}
            {currentScope === 'CATEGORY' && (
                <CouponCategories
                    form={form}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                ></CouponCategories>
            )}
        </ModalForm>
    );
};

export default CreateCouponModal;
