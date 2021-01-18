import * as React from 'react';
import { TableGenerator, AntForm } from '../components';
import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import useFormAdd from './useFormAdd';
import useFormEdit from './useFormEdit';

import { returnItemStruct } from '../struct';

const { useMemo } = React;

export default () => {
  const api = '/api/v1/item/';

  const { addFields, visibleFormAdd, closeFormAdd, openFormAdd, onFormAddFinish } = useFormAdd({
    api,
    fieldsStruct: returnItemStruct(),
  });

  const { editFields, visibleFormEdit, initialValuesFormEdit, closeFormEdit, openFormEdit, onFormEditFinish } = useFormEdit({
    api,
    fieldsStruct: returnItemStruct(true),
  });

  const tableMainProps = {
    handleAddBtnClick: openFormAdd,
  };

  let X: any;

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
            <a onClick={() => openFormEdit(item)} style={{ marginRight: '12px' }}>
              编辑
            </a>
            <a onClick={() => handleDelete(item)}>删除</a>
          </>
        );
      },
    },
  ];

  const addBtn = {
    name: '添加链接',
    type: 'model',
  };

  const tableRowKey = 'id';

  const tmpC = columns.filter((item) => item.supportSearch);
  const withSearch = tmpC.length > 0;

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
        title={'添加链接'}
        fields={addFields}
        visible={visibleFormAdd}
        initialValues={{}}
        onCancel={closeFormAdd}
        onFinish={async (values: any) => {
          await onFormAddFinish(values);
          X.fns.refresh();
        }}
      />
    ),
    [visibleFormAdd]
  );

  const FormEdit = useMemo(
    () => (
      <AntForm
        title='编辑标签'
        fields={editFields}
        visible={visibleFormEdit}
        initialValues={initialValuesFormEdit}
        onCancel={closeFormEdit}
        onFinish={async (values: any) => {
          await onFormEditFinish(values);
          X.fns.refresh();
        }}
      />
    ),
    [visibleFormEdit]
  );

  return (
    <>
      {/* {TheRealTable()} */}
      <TheRealTable />
      {FormAdd}
      {FormEdit}
    </>
  );
};
