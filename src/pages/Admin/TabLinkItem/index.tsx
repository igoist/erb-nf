import * as React from 'react';
import { TableGenerator, AntForm } from '../components';
import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import useFormAdd from './useFormAdd';
import useFormEdit from './useFormEdit';

export default () => {
  const { addItemTypeFields, visibleFormAddItemType, closeFormAddItemType, openFormAddItemType, onFormAddItemTypeFinish } = useFormAdd();
  const { editItemFields, visibleFormEditItem, initialValuesFormEdit, closeFormEditItem, openFormEditItem, onFormEditItemFinish } = useFormEdit();

  const tableMainProps = {
    handleAddBtnClick: openFormAddItemType,
  };

  const handleDelete = (item: any) => {
    const { id, title } = item;
    console.log('handleDelete', item);
    Modal.confirm({
      title: '链接删除确认',
      icon: <ExclamationCircleOutlined />,
      content: `确定删除 id: ${id}, 标题: "${title}" 的链接？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        await fetch(`http://localhost:6085/api/v1/item/${id}`, {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }).then((res) => {
          console.log(`/api/v1/item/${id}:`, res);
          if (res && res.status === 200) {
            message.success('链接删除成功');
            // run();
          }
        });
      },
      // onCancel: () => {}
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      supportSearch: true,
    },
    {
      title: '标题',
      dataIndex: '',
      supportSearch: true,
      render: (item: any) => (
        <a href={item.link} target='_blank' title={item.excerpt}>
          {item.title}
        </a>
      ),
    },
    // {
    //   title: '摘要',
    //   dataIndex: 'excerpt',
    //   supportSearch: false,
    // },
    {
      title: '操作',
      dataIndex: '',
      supportSearch: false,
      key: 'x',
      render: (item: any) => {
        return (
          <>
            <a onClick={() => openFormEditItem(item)} style={{ marginRight: '12px' }}>
              编辑
            </a>
            <a onClick={() => handleDelete(item)}>删除</a>
          </>
        );
      },
    },
  ];

  const api = '/api/v1/item/';

  const addBtn = {
    name: '添加链接',
    type: 'model',
  };

  const tableRowKey = 'id';

  const tmpC = columns.filter((item) => item.supportSearch);
  const withSearch = tmpC.length > 0;

  const TableMain = TableGenerator({
    columns,
    api,
    addBtn,
    tableRowKey,
    withSearch,
  });

  return (
    <>
      <TableMain {...tableMainProps} />
      <AntForm
        title={'添加链接'}
        fields={addItemTypeFields}
        visible={visibleFormAddItemType}
        initialValues={{}}
        onCancel={closeFormAddItemType}
        onFinish={onFormAddItemTypeFinish}
      />
      <AntForm
        title='编辑标签'
        fields={editItemFields}
        visible={visibleFormEditItem}
        initialValues={initialValuesFormEdit}
        onCancel={closeFormEditItem}
        onFinish={onFormEditItemFinish}
      />
    </>
  );
};
