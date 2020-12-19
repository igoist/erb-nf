import * as React from 'react';
import { TableGenerator, AntForm } from '../components';
import useModelVisible from '../useModelVisible';
import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

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
      name: 'title',
      label: '标题',
      required: true,
    },
    {
      name: 'link',
      label: '链接地址',
      required: true,
    },
    {
      name: 'excerpt',
      label: '备注、摘要',
      required: false,
      type: 'TextArea',
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
        title={'添加链接'}
        fields={addItemTypeFields}
        visible={visibleFormAddItemType}
        initialValues={{}}
        onCancel={closeFormAddItemType}
        onFinish={onFormAddItemTypeFinish}
      />
    </>
  );
};
