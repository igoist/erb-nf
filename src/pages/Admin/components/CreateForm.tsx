import * as React from 'react';
import { Modal } from 'antd';

interface CreateFormProps {
  visible: boolean;
  title: string;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  return (
    <Modal destroyOnClose {...props} footer={null}>
      {props.children}
    </Modal>
  );
};

export default CreateForm;
