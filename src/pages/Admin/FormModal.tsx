import * as React from 'react';
import { Button, Form, Input, Select, Switch } from 'antd';

import CreateForm from './components/CreateForm';

const { Item } = Form;
const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const FormModal = (props: any) => {
  const { onCancel, visible, initialValues, onFinish } = props;

  return (
    <CreateForm onCancel={onCancel} visible={visible} title={'Add item'}>
      <Form {...layout} name='basic' initialValues={initialValues} onFinish={onFinish} onFinishFailed={() => {}}>
        <Item label='Id' name='id' rules={[{ required: false }]} style={{ display: 'none' }}>
          <Input />
        </Item>

        <Item label='Index' name='index' rules={[{ required: false }]} style={{ display: 'none' }}>
          <Input />
        </Item>

        <Item label='Name' name='name' rules={[{ required: true, message: 'Item name please!' }]}>
          <Input />
        </Item>

        {/* <Item label='Type' name='type' rules={[{ required: true, message: 'Item type please!' }]}>
            <Input />
          </Item> */}

        <Item label='Type' name='type' rules={[{ required: true, message: 'Item type please!' }]}>
          <Select placeholder='Select the item type' allowClear>
            <Option value='ScrollList'>ScrollList</Option>
            <Option value='Music'>Music</Option>
            <Option value='Search'>Search</Option>
            <Option value='Admin'>Admin</Option>
            <Option value='PageGenerator'>PageGenerator</Option>
            <Option value='PictureWall'>PictureWall</Option>
          </Select>
        </Item>

        <Item label='Meta Title' name='title' rules={[{ required: false, message: 'Please meta title please!' }]}>
          <Input />
        </Item>

        <Item label='Meta Link' name='link' rules={[{ required: false, message: 'Meta link please!' }]}>
          <Input />
        </Item>

        <Item label='API' name='api' rules={[{ required: false, message: 'Item API please!' }]}>
          <Input />
        </Item>

        <Item label='Visible' name='visible'>
          <Switch defaultChecked={initialValues.visible} />
        </Item>

        <Item label='IsSearchHidden' name='isSearchHidden'>
          <Switch defaultChecked={initialValues.isSearchHidden} />
        </Item>

        <Item wrapperCol={{ offset: 8 }}>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Item>
      </Form>
    </CreateForm>
  );
};

export default FormModal;
