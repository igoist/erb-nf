import * as React from 'react';
import { TablePage } from '@Components';

import { returnItemTypeStruct } from '../struct';

export default () => {
  const props = {
    api: '/api/v1/item/type/',
    label: '标签',
    returnStruct: returnItemTypeStruct,
    columnsMain: [
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
    ],
  };

  return <TablePage {...props} />;
};
