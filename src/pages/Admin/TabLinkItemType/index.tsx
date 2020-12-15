import * as React from 'react';
import { TableGenerator, FormAdd } from '../components';
import useModelVisible from '../useModelVisible';

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
      <FormAdd
        fields={addItemTypeFields}
        visible={visibleFormAddItemType}
        initialValues={{}}
        onCancel={closeFormAddItemType}
        onFinish={onFormAddItemTypeFinish}
      />
    </>
  );
};
