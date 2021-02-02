import * as React from 'react';
import AntForm from '../AntForm';
import TableGenerator from '../TableGenerator';
import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import useFormAdd from './useFormAdd';
import useFormEdit from './useFormEdit';

const { useMemo } = React;

type TablePagePropsType = {
  api: string,
  label: string,
  returnStruct: any,
  columnsMain: Array<any>,
};

const TablePage = ({ api, label, returnStruct, columnsMain }: TablePagePropsType) => {
  const { addFields, visibleFormAdd, closeFormAdd, openFormAdd, onFormAddFinish } = useFormAdd({
    api,
    fieldsStruct: returnStruct(),
  });

  const { editFields, visibleFormEdit, initialValuesFormEdit, closeFormEdit, openFormEdit, onFormEditFinish } = useFormEdit({
    api,
    fieldsStruct: returnStruct(true),
  });

  const tableMainProps = {
    handleAddBtnClick: openFormAdd,
  };

  let X: any;

  const handleDelete = (item: any) => {
    const { id, name } = item;
    console.log('handleDelete', item);
    Modal.confirm({
      title: `${label}删除确认`,
      icon: <ExclamationCircleOutlined />,
      content: `确定删除 id: ${id}, 名称: "${name}" 的${label}？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        await fetch(`http://localhost:6085${api}${id}`, {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }).then((res) => {
          console.log(`${api}${id}:`, res);
          if (res && res.status === 200) {
            message.success(`${label}删除成功`);
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
    ...columnsMain,
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
    name: `添加${label}`,
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
        title={`添加${label}`}
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
        title={`编辑${label}`}
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
      <TheRealTable />
      {FormAdd}
      {FormEdit}
    </>
  );
};

export default TablePage;
