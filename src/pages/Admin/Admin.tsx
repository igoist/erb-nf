import * as React from 'react';
import T from './T';
import { Button, Image, Tabs } from 'antd';

const { TabPane } = Tabs;

const A = () => {
  return (
    <div style={{ padding: '20px', height: '560px', overflow: 'scroll' }}>
      <Tabs defaultActiveKey='1'>
        <TabPane tab='栏目自定义' key='1'>
          <T />
        </TabPane>
        <TabPane tab='Tab 2' key='2'>
          Content of Tab Pane 2
        </TabPane>
        <TabPane tab='Tab 3' key='3'>
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    </div>
  );
};

export default A;
