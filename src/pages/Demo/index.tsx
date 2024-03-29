import * as React from 'react';
import { ipcRenderer } from 'electron';
import { Tabs } from 'antd';
import { useKeyPress } from 'ahooks';
// import './test.css';
import '../../../dist/css/demo.css';

import F from './F';
import T from './T';
import T02 from './T02';
import T03 from './T03';
import T04 from './T04';
import T05 from './T05';
import { dom } from '@Utils';

const { useEffect } = React;
const { TabPane } = Tabs;
const { Q, removeClass, addClass, ETFade, scrollSmothlyTo } = dom;

const Demo = () => {
  const pf = 'et-demo';

  const commonTabProps = {
    pf,
  };

  const tabsArr = [
    {
      name: 'Tab F',
      component: <F {...commonTabProps} />,
    },
    {
      name: 'Tab T',
      component: <T {...commonTabProps} />,
    },
    {
      name: 'Tab T02',
      component: <T02 {...commonTabProps} />,
    },
    {
      name: 'Tab T03',
      component: <T03 {...commonTabProps} />,
    },
    {
      name: 'Tab T04',
      component: <T04 {...commonTabProps} />,
    },
    {
      name: 'Tab T05-demo',
      component: <T05 />,
    },
  ];

  const tabsArrLength = tabsArr.length;

  const [activeKeyIndex, setActiveKeyIndex] = React.useState(0);

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
    [],
  );

  // full screen
  useEffect(() => {
    ipcRenderer.send('change-win', {
      type: 'switch-full-screen',
      flag: true,
    });

    ipcRenderer.once('switch-full-screen-complete', () => {
      console.log('enter switch-full-screen-complete');
      let wrap = Q(`.${pf}-wrap`);
      let w = Q(`.${pf}`);

      setTimeout(() => {
        removeClass('is-hidden', wrap);

        ETFade({
          el: w,
          isEnter: true,
        });
      }, 16);
    });

    ipcRenderer.once('et-fade-leave-renderer', () => {
      let wrap = Q(`.${pf}-wrap`);
      let w = Q(`.${pf}`);

      setTimeout(() => {
        ETFade({
          el: w,
          callback: () => {
            addClass('is-hidden', wrap);
            // ReactDOM.unmountComponentAtNode(wrap);

            setTimeout(() => {
              ipcRenderer.send('et-to-mode-zero');
            }, 16);
          },
        });
      }, 16);
    });

    return () => {
      ipcRenderer.send('change-win', {
        type: 'switch-full-screen',
        flag: false,
      });
    };
  }, []);

  return (
    <div className={`${pf}-wrap is-hidden`}>
      <div className={`${pf}`}>
        <Tabs activeKey={`tab-${activeKeyIndex}`} onChange={handleOnChange}>
          {TabPanes}
        </Tabs>
      </div>
    </div>
  );
};

export default Demo;
