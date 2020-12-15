import * as React from 'react';
import { Modal, Form, Input, Select, Switch } from 'antd';

const { useEffect } = React;
const { TextArea } = Input;
const { Option } = Select;

type FormAddPropsType = {
  fields: Array<any>,
  visible: boolean,
  initialValues: any,
  onCancel: any,
  onFinish: any
};

/**
 * fields:        由上层组件定义的 fields 数组
 * visible:       是否显示
 * initialValues: form 的默认值
 * onCancel:      关闭后回调，一般是将 visible 设置回 false
 * onFinish:      能够得到 form 各字段的值
 */
const FormAdd = ({ fields, visible, initialValues, onCancel, onFinish }: FormAddPropsType) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      // 当 form 可见，重置数值 (resetFields 用于重置字段到 initialValues)
      form.resetFields();
    }
  }, [visible]);

  const onOk = () => {
    form.submit();
  };

  let formInner: any = [];
  fields.map((item, index) => {
    const { name, label, required, valuePropName, select, message } = item;
    let tmpInner;
    if (item.type === undefined) {
      tmpInner = (
        <Form.Item key={index} name={name} label={label} rules={[{ required, message }]}>
          <Input />
        </Form.Item>
      );
    } else if (item.type === 'TextArea') {
      tmpInner = (
        <Form.Item key={index} name={name} label={label} rules={[{ required, message }]}>
          <TextArea />
        </Form.Item>
      );
    } else if (item.type === 'Switch') {
      tmpInner = (
        <Form.Item key={index} name={name} label={label} rules={[{ required, message }]} valuePropName={valuePropName}>
          <Switch />
        </Form.Item>
      );
    } else if (item.type === 'Select') {
      let tmp = [];
      const { options, placeholder, allowClear } = select;
      for (let i = 0; i < options.length; i++) {
        tmp.push(
          <Option key={i} value={options[i].value}>
            {options[i].name}
          </Option>
        );
      }

      tmpInner = (
        <Form.Item key={index} name={name} label={label} rules={[{ required, message }]} valuePropName={valuePropName}>
          <Select placeholder={placeholder} allowClear={allowClear}>
            {tmp}
          </Select>
        </Form.Item>
      );
    }
    formInner.push(tmpInner);
  });

  return (
    <Modal title='添加' visible={visible} onOk={onOk} onCancel={onCancel}>
      <Form form={form} layout='vertical' name='addForm' onFinish={onFinish} initialValues={initialValues}>
        {formInner}
      </Form>
    </Modal>
  );
};

export default FormAdd;
