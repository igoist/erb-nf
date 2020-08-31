import * as React from 'react';
import { ipcRenderer, remote } from 'electron';
import { createContainer } from 'unstated-next';
import { ListItemInterface } from '../Interfaces';

import { useRequest } from 'ahooks';

const { useState, useEffect } = React;

declare var window: any;

const originData: Array<ListItemInterface> = remote.getGlobal('sharedObject').originData;

const AppArr: any = [
  {
    name: 'Apps',
    mode: 0
  },
  {
    name: 'Search',
    mode: 1
  },
  {
    name: 'Zhihu',
    mode: 2
  },
  {
    name: 'Music',
    mode: 3
  },
  {
    name: 'Douban Renting',
    mode: 4
  }
];

const baseUrl = 'http://10.0.1.78:6085';

type MCResultType = {
  mode: number,
  list: Array<any>
};

const ff = (url: string, mode: number) => {
  // return fetch(`${baseUrl}/api/v1/list/${0}`)
  return fetch(url)
    .then((res: any) => res.json())
    .then((r: any) => {
      if (r.Code === 0) {
        return {
          mode,
          list: r.list
        };
      } else {
        return {
          mode,
          list: []
        };
      }
    })
    .catch((e) => {
      console.log('ff error: ', e);
      return {
        mode: 0,
        list: []
      };
    });
};

const handleSwitch = (mode: number) => {
  return new Promise(async (resolve) => {
    let r: MCResultType;
    switch (mode) {
      case 0:
        r = {
          mode,
          list: AppArr
        };
        break;
      case 1:
        r = {
          mode,
          list: originData
        };
        break;
      case 2:
        r = await ff(`${baseUrl}/api/v1/list/${0}/incognito`, 2);
        break;
      case 3:
        r = {
          mode,
          list: [1, 2]
        };
        break;
      case 4:
        r = await ff(`${baseUrl}/api/v1/renting/${0}/`, 4);
        break;
      default:
        r = {
          mode,
          list: AppArr
        };
        break;
    }

    window.r = r;
    setTimeout(() => {
      resolve(r);
    }, 300);
  });
};

const handleModeChange = (mode: number = 0): any => {
  return new Promise(async (resolve) => {
    let tmpMode = mode;

    if (tmpMode === AppArr.length) {
      tmpMode = 0;
    }

    let r = await handleSwitch(tmpMode);
    resolve(r);
  });
};

const useAppHook = () => {
  const [value, setValue] = useState('');
  const [result, setResult] = useState([]);
  const [mode, setMode] = useState(0);

  const { data, error, loading, run } = useRequest(handleModeChange);

  useEffect(() => {
    setResult([]);
    run(mode);
  }, [mode]);

  const toNextMode = () => {
    let tmp = mode + 1;
    if (tmp === AppArr.length) {
      tmp = 0;
    }
    setMode(tmp);
  };

  const getCurrentValue = () => {
    return mode;
  };

  const dispatch = (action: any) => {
    console.log('dis: ', action);
    switch (action.type) {
      case 'toNextMode':
        toNextMode();
        break;
      case 'save':
        setValue(action.payload.value);
        // setResult(action.payload.result);
        break;
      case 'saveResult':
        setResult(action.payload.result);
        break;
      case 'saveBoth':
        setResult(action.payload.result);
        setResult(action.payload.result);
        break;
      default:
        break;
    }
  };

  return {
    value,
    setValue,
    data: data || { list: [], mode: 0 },
    loading,
    // setData,
    result,
    setResult,
    mode,
    setMode,
    // toNextMode,
    getCurrentValue,
    dispatch
  };
};

const AppHook = createContainer(useAppHook);

export default AppHook;

export { AppArr };
