import * as React from 'react';
import { TableGenerator, AntForm } from '../components';
import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import useFormAdd from './useFormAdd';
import useFormEdit from './useFormEdit';

const { useMemo } = React;

export default () => {
  const { addItemTypeFields, visibleFormAddItemType, closeFormAddItemType, openFormAddItemType, onFormAddItemTypeFinish } = useFormAdd();
  const {
    editItemTypeFields,
    visibleFormEditItemType,
    initialValuesFormEdit,
    closeFormEditItemType,
    openFormEditItemType,
    onFormEditItemTypeFinish,
  } = useFormEdit();

  const tableMainProps = {
    handleAddBtnClick: openFormAddItemType,
  };

  let X: any;

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
            // use the X.fns.refresh after it has been assigned, so we can define it first
            X.fns.refresh();
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
            <a onClick={() => openFormEditItemType(item)} style={{ marginRight: '12px' }}>
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

  // Snippet with useMemo
  // const [fns, TheRealTable] = useMemo(() => {
  //   console.log('here X');
  //   const TableMain = TableGenerator({
  //     columns,
  //     api,
  //     addBtn,
  //     tableRowKey,
  //     withSearch,
  //   });

  //   // return <TableMain {...tableMainProps} />;
  //   const X: any = TableMain(tableMainProps);
  //   console.log('here X: ', X);
  //   console.log('here X: ', X.component);
  //   return [X.fns, X.component];
  // }, []);

  // Snippet without useMemo
  const TableMain = TableGenerator({
    columns,
    api,
    addBtn,
    tableRowKey,
    withSearch,
  });

  X = TableMain(tableMainProps);
  const TheRealTable = X.component;

  const FormAdd = useMemo(
    () => (
      <AntForm
        title='添加标签'
        fields={addItemTypeFields}
        visible={visibleFormAddItemType}
        initialValues={{}}
        onCancel={closeFormAddItemType}
        onFinish={async (values: any) => {
          await onFormAddItemTypeFinish(values);
          X.fns.refresh();
        }}
      />
    ),
    [visibleFormAddItemType]
  );

  const FormEdit = useMemo(
    () => (
      <AntForm
        title='编辑标签'
        fields={editItemTypeFields}
        visible={visibleFormEditItemType}
        initialValues={initialValuesFormEdit}
        onCancel={closeFormEditItemType}
        onFinish={async (values: any) => {
          await onFormEditItemTypeFinish(values);
          X.fns.refresh();
        }}
      />
    ),
    [visibleFormEditItemType]
  );

  return (
    <>
      <TheRealTable />
      {FormAdd}
      {FormEdit}
    </>
  );
};
