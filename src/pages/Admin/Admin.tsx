import * as React from 'react';
import T from './T';
import T2 from './T2';
import { Tabs } from 'antd';

import TabLinkItem from './TabLinkItem';
import TabLinkItemType from './TabLinkItemType';

const { TabPane } = Tabs;

const A = () => {
  return (
    <div style={{ padding: '20px', height: '560px', overflow: 'scroll' }}>
      <Tabs defaultActiveKey='1'>
        <TabPane tab='栏目自定义' key='1'>
          <T />
        </TabPane>
        <TabPane tab='Tab 2' key='2'>
          <T2 />
        </TabPane>
        <TabPane tab='TabLinkItem' key='TabLinkItem'>
          <TabLinkItem />
        </TabPane>
        <TabPane tab='TabLinkItemType' key='TabLinkItemType'>
          <TabLinkItemType />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default A;
