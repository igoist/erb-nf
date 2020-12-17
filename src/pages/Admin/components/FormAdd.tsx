import * as React from 'react';
import { Modal, DatePicker, TimePicker, Form, Input, InputNumber, Select, Switch, Upload } from 'antd';

const { useEffect } = React;
const { TextArea } = Input;
const { Option } = Select;

/**
 * form:          antd Form 的 form 对象
 * fields:        由上层组件定义的 fields 数组
 * visible:       是否显示
 * initialValues: form 的默认值
 * onFinish:      能够得到 form 各字段的值
 */

const FormGenerator = ({ form, fields, initialValues, onFinish }: any) => {
  let formInner: any = [];

  fields.map((item: any, index: number) => {
    const { name, label, required, style, valuePropName, message, extra } = item;
    let tmpInner;

    /**
     * Form.Item (几乎)通用 props
     * key:   组件 key
     * name:  字段名
     * label: 字段标签
     * rules: [是否必须，默认值]
     * style: 自定义样式
     **/
    const itemPropsCommon = {
      key: index,
      name,
      label,
      rules: [{ required, message }],
      style,
    };

    if (item.type === undefined) {
      tmpInner = (
        <Form.Item {...itemPropsCommon}>
          <Input {...extra} />
        </Form.Item>
      );
    } else if (item.type === 'InputNumber') {
      tmpInner = (
        <Form.Item {...itemPropsCommon}>
          <InputNumber {...extra} />
        </Form.Item>
      );
    } else if (item.type === 'DatePicker') {
      tmpInner = (
        <Form.Item {...itemPropsCommon}>
          <DatePicker {...extra} />
        </Form.Item>
      );
    } else if (item.type === 'TimePicker') {
      tmpInner = (
        <Form.Item {...itemPropsCommon}>
          <TimePicker {...extra} />
        </Form.Item>
      );
    } else if (item.type === 'TextArea') {
      tmpInner = (
        <Form.Item {...itemPropsCommon}>
          <TextArea {...extra} />
        </Form.Item>
      );
    } else if (item.type === 'Dragger') {
      const { noStyle, action, multiple, getValueFromEvent, onChange } = extra;
      tmpInner = (
        <Form.Item key={index} label={label} rules={[{ required, message }]} style={style}>
          <Form.Item name={name} valuePropName={valuePropName} getValueFromEvent={getValueFromEvent} noStyle={noStyle}>
            <Upload.Dragger name='file' action={action} multiple={multiple} onChange={onChange}>
              {/* <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p> */}
              <p className='ant-upload-text'>点击或拖拽文件到这里</p>
              {/* <p className="ant-upload-hint">Support for a single or bulk upload.</p> */}
            </Upload.Dragger>
          </Form.Item>
        </Form.Item>
      );
    } else if (item.type === 'Switch') {
      tmpInner = (
        <Form.Item {...itemPropsCommon} valuePropName={valuePropName}>
          <Switch {...extra} />
        </Form.Item>
      );
    } else if (item.type === 'Select') {
      let tmp = [];
      const { options, placeholder, allowClear } = extra;
      for (let i = 0; i < options.length; i++) {
        tmp.push(
          <Option key={i} value={options[i].value}>
            {options[i].name}
          </Option>
        );
      }

      tmpInner = (
        <Form.Item {...itemPropsCommon} valuePropName={valuePropName}>
          <Select placeholder={placeholder} allowClear={allowClear}>
            {tmp}
          </Select>
        </Form.Item>
      );
    }
    formInner.push(tmpInner);
  });

  return (
    <Form form={form} layout='vertical' name='addForm' onFinish={onFinish} initialValues={initialValues}>
      {formInner}
    </Form>
  );
};

/**
 * fields:        由上层组件定义的 fields 数组
 * visible:       是否显示
 * initialValues: form 的默认值
 * onCancel:      关闭后回调，一般是将 visible 设置回 false
 * onFinish:      能够得到 form 各字段的值
 */
type FormPropsType = {
  title?: string,
  fields: any,
  visible: boolean,
  initialValues: any,
  onCancel: any,
  onFinish: any,
};

const AntForm = ({ title, fields, visible, initialValues, onCancel, onFinish }: FormPropsType) => {
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

  const FGProps = {
    form,
    fields,
    initialValues,
    onFinish,
  };

  return (
    <Modal title={title || '添加'} visible={visible} onOk={onOk} onCancel={onCancel}>
      <FormGenerator {...FGProps} />
    </Modal>
  );
};

export default AntForm;
