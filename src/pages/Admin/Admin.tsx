import * as React from 'react';
import { ipcRenderer } from 'electron';
import { Tabs } from 'antd';
import { useKeyPress } from 'ahooks';

import T from './T';
import T2 from './T2';
import TabLinkItem from './TabLinkItem';
import TabLinkItemType from './TabLinkItemType';
import TabLinkItemZhihu from './TabLinkItemZhihu';
import { dom } from '@Utils';

const { useEffect } = React;
const { TabPane } = Tabs;
const { scrollSmothlyTo } = dom;

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
    {
      name: 'TabLinkItemZhihu',
      component: <TabLinkItemZhihu />,
    },
  ];

  const tabsArrLength = tabsArr.length;

  const [activeKeyIndex, setActiveKeyIndex] = React.useState(tabsArrLength - 1);

  useKeyPress(['meta.shift.[', 'meta.['], () => {
    setActiveKeyIndex((activeKeyIndex + tabsArrLength - 1) % tabsArrLength);
  });

  useKeyPress(['meta.shift.]', 'meta.]'], () => {
    setActiveKeyIndex((activeKeyIndex + tabsArrLength + 1) % tabsArrLength);
  });

  useKeyPress(['ctrl.j'], () => {
    scrollSmothlyTo(100);
  });

  useKeyPress(['ctrl.k'], () => {
    scrollSmothlyTo(-100);
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

  // full screen
  useEffect(() => {
    ipcRenderer.send('change-win', {
      type: 'switch-full-screen',
      flag: true,
    });

    return () => {
      ipcRenderer.send('change-win', {
        type: 'switch-full-screen',
        flag: false,
      });
    };
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Tabs activeKey={`tab-${activeKeyIndex}`} onChange={handleOnChange}>
        {TabPanes}
      </Tabs>
    </div>
  );
};

export default A;
