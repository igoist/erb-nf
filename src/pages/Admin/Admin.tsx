import * as React from 'react';
import { Tabs } from 'antd';
import { useKeyPress } from 'ahooks';

import T from './T';
import T2 from './T2';
import TabLinkItem from './TabLinkItem';
import TabLinkItemType from './TabLinkItemType';

const { TabPane } = Tabs;

const A = () => {
  const tabsArr = [
    {
      name: '栏目自定义',
      component: <T />,
    },
    {
      name: 'Tab 2',
      component: <T2 />,
    },
    {
      name: 'TabLinkItem',
      component: <TabLinkItem />,
    },
    {
      name: 'TabLinkItemType',
      component: <TabLinkItemType />,
    },
  ];

  const tabsArrLength = tabsArr.length;

  const [activeKeyIndex, setActiveKeyIndex] = React.useState(3);

  useKeyPress(['meta.shift.[', 'meta.['], () => {
    setActiveKeyIndex((activeKeyIndex + tabsArrLength - 1) % 4);
  });

  useKeyPress(['meta.shift.]', 'meta.]'], () => {
    setActiveKeyIndex((activeKeyIndex + tabsArrLength + 1) % 4);
  });

  const handleOnChange = (activeKey: any) => {
    console.log(activeKey);

    setActiveKeyIndex(parseInt(activeKey.slice(4, activeKey.length)));
  };

  const TabPanes = React.useMemo(
    () =>
      tabsArr.map((tab, index) => (
        <TabPane tab={tab.name} key={`tab-${index}`}>
          {tab.component}
        </TabPane>
      )),
    []
  );

  return (
    <div style={{ padding: '20px', height: '560px', overflow: 'scroll' }}>
      <Tabs activeKey={`tab-${activeKeyIndex}`} onChange={handleOnChange}>
        {TabPanes}
      </Tabs>
    </div>
  );
};

export default A;
