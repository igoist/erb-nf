import * as React from 'react';
import { TablePage } from '@Components';

import { returnItemStruct } from '../struct';

export default () => {
  const props = {
    api: '/api/v1/item/',
    label: '链接',
    returnStruct: returnItemStruct,
    columnsMain: [
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
    ],
  };

  return <TablePage {...props} />;
};
