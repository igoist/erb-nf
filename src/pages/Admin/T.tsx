import * as React from 'react';
import { Button, Divider, List, Typography, Space, Form, Input, message } from 'antd';

import CreateForm from './components/CreateForm';
import useAdminHook from './useAdminHook';

const { Item } = Form;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

const warning = (s = 'Unlock it first~') => {
  return () => {
    message.warning(s);
  };
};

const T = () => {
  const { createModalVisible, formData, data, mode, dispatch } = useAdminHook();

  const handleCreateModalVisible = (visible: boolean) => {
    dispatch({
      type: 'ModalVisible',
      payload: {
        visible
      }
    });
  };

  const openAddModal = () => {
    handleCreateModalVisible(true);
    dispatch({
      type: 'SetMode',
      payload: {
        mode: 1
      }
    });
  };

  const openEditModal = (index: number) => {
    dispatch({
      type: 'OpenItemEditModal',
      payload: {
        index
      }
    });
    dispatch({
      type: 'SetMode',
      payload: {
        mode: 2
      }
    });
  };

  const closeModal = () => {
    handleCreateModalVisible(false);
    dispatch({
      type: 'SetMode',
      payload: {
        mode: 0
      }
    });
  };

  const handleAdd = (fields: any) => {
    handleCreateModalVisible(false);
    dispatch({
      type: 'ItemAdd',
      payload: {
        ...fields
      }
    });
  };

  const handleEdit = (fields: any) => {
    handleCreateModalVisible(false);
    dispatch({
      type: 'ItemEdit',
      payload: {
        ...fields
      }
    });
  };

  const handleLockUnlock = (locked: boolean, index: number) => {
    if (locked) {
      dispatch({
        type: 'ItemUnlock',
        payload: {
          index
        }
      });
    } else {
      dispatch({
        type: 'ItemLock',
        payload: {
          index
        }
      });
    }
  };

  const handleFinish = () => {
    if (mode === 0) {
      return null;
    } else if (mode === 1) {
      return handleAdd;
    } else if (mode === 2) {
      return handleEdit;
    }
  };

  const handleDelete = (index: number) => {
    dispatch({
      type: 'ItemDelete',
      payload: {
        index
      }
    });
  };

  const styleLock = (locked: boolean) => {
    if (locked) {
      return { cursor: 'not-allowed' };
    } else {
      return {};
    }
  };

  return (
    <>
      <Space style={{ marginBottom: 16, float: 'right' }} align='center'>
        <Button onClick={openAddModal}>新增</Button>
        <Button>删除</Button>
        {/* <Button>Clear filters and sorters</Button> */}
      </Space>
      <Divider orientation='left'>ERB Items</Divider>

      <List
        header={<div>Header</div>}
        // footer={<div>Footer</div>}
        bordered
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <a key='list-l' onClick={() => handleLockUnlock(item.locked, index)}>
                {item.locked ? 'unlock' : 'lock'}
              </a>,
              <a key='list-edit' style={styleLock(item.locked)} onClick={item.locked ? warning() : () => openEditModal(index)}>
                edit{index}
              </a>,
              <a key='list-delete' style={styleLock(item.locked)} onClick={item.locked ? warning() : () => handleDelete(index)}>
                delete
              </a>
            ]}
          >
            <Typography.Text mark>[ITEM]</Typography.Text> {item.name}
          </List.Item>
        )}
      />

      <CreateForm onCancel={closeModal} visible={createModalVisible} title={'Add item'}>
        <Form {...layout} name='basic' initialValues={mode === 2 ? formData : {}} onFinish={handleFinish()} onFinishFailed={() => {}}>
          <Item label='Index' name='index' rules={[{ required: false }]} style={{ display: 'none' }}>
            <Input />
          </Item>

          <Item label='Name' name='name' rules={[{ required: true, message: 'Item name please!' }]}>
            <Input />
          </Item>

          <Item label='Type' name='type' rules={[{ required: true, message: 'Item type please!' }]}>
            <Input />
          </Item>

          <Item label='Meta Title' name='title' rules={[{ required: true, message: 'Please meta title please!' }]}>
            <Input />
          </Item>

          <Item label='Meta Link' name='link' rules={[{ required: true, message: 'Meta link please!' }]}>
            <Input />
          </Item>

          <Item wrapperCol={{ offset: 8 }}>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
          </Item>
        </Form>
      </CreateForm>
    </>
  );
};

export default T;
