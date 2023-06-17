import React from 'react';
import { ActionType } from '@ant-design/pro-components';

interface CreateProductModalProps {
    createModalOpen: boolean;
    handleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    actionRef: React.MutableRefObject<ActionType | undefined>;
    currentRow?: API.Product;
}
const CreateBrandModal: React.FC<CreateProductModalProps> = ({
    createModalOpen,
    handleModalOpen,
    actionRef,
    currentRow,
}) => {
    return <div>CreateBrandModal</div>;
};

export default CreateBrandModal;
