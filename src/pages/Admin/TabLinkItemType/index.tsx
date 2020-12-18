import * as React from 'react';
import { TableGenerator, AntForm } from '../components';
import useModelVisible from '../useModelVisible';
import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const handleDelete = (item: any) => {
  const { id, name } = item;
  console.log('handleDelete', item);
  Modal.confirm({
    title: '标签删除确认',
    icon: <ExclamationCircleOutlined />,
    content: `确定删除 id: ${id}, 名称: "${name}" 的标签？`,
    okText: '确认',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      await fetch(`http://localhost:6085/api/v1/item/type/${id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).then((res) => {
        console.log(`/api/v1/item/type/${id}:`, res);
        if (res && res.status === 200) {
          message.success('标签删除成功');
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
    title: '类型',
    dataIndex: 'name',
    supportSearch: true,
  },
  {
    title: '排序',
    dataIndex: 'sort',
    supportSearch: false,
  },
  {
    title: '操作',
    dataIndex: '',
    supportSearch: false,
    key: 'x',
    render: (item: any) => {
      return (
        <>
          <a href={`/admin/anchor/edit/${item.id}`} target='_blank' style={{ marginRight: '12px' }}>
            编辑
          </a>
          <a onClick={() => handleDelete(item)}>删除</a>
        </>
      );
    },
  },
];

const api = '/api/v1/item/type/';

const addBtn = {
  name: '添加标签',
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

const useFormAddItemType = () => {
  const { visible: visibleFormAddItemType, closeModel: closeFormAddItemType, openModel: openFormAddItemType } = useModelVisible();

  const onFormAddItemTypeFinish = async (values: any) => {
    closeFormAddItemType();

    console.log('onFormAddItemTypeFinish: ', values);

    let r = await fetch(`http://localhost:6085${api}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((res) => res);

    console.log('onFormAddItemTypeFinish msg: ', r);
  };

  const addItemTypeFields = [
    {
      name: 'name',
      label: '链接类型',
      required: true,
    },
    {
      name: 'sort',
      label: '排序',
      required: false,
    },
  ];

  return {
    addItemTypeFields,
    visibleFormAddItemType,
    closeFormAddItemType,
    openFormAddItemType,
    onFormAddItemTypeFinish,
  };
};

export default () => {
  const { addItemTypeFields, visibleFormAddItemType, closeFormAddItemType, openFormAddItemType, onFormAddItemTypeFinish } = useFormAddItemType();

  const tableMainProps = {
    handleAddBtnClick: openFormAddItemType,
  };

  return (
    <>
      <TableMain {...tableMainProps} />
      <AntForm
        fields={addItemTypeFields}
        visible={visibleFormAddItemType}
        initialValues={{}}
        onCancel={closeFormAddItemType}
        onFinish={onFormAddItemTypeFinish}
      />
    </>
  );
};
