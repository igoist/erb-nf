import * as React from 'react';
import { TableGenerator } from '../components';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    supportSearch: true
  },
  {
    title: '标题',
    dataIndex: '',
    supportSearch: true,
    render: (item: any) => (
      <a href={item.link} target='_blank'>
        {item.title}
      </a>
    )
  },
  {
    title: '摘要',
    dataIndex: 'excerpt',
    supportSearch: false
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
            删除
          </a>
        </>
      );
    }
  }
];

const api = '/api/v1/item/list';

// const addBtn = {
//   name: '添加讲师',
//   url: '/admin/anchor/add'
// };

const tableRowKey = 'id';

const tmpC = columns.filter((item) => item.supportSearch);
const withSearch = tmpC.length > 0;

export default TableGenerator({
  columns,
  api,
  // addBtn,
  tableRowKey,
  withSearch
});
