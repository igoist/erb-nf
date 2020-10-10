import * as React from 'react';
import { ipcRenderer, remote } from 'electron';
import { createContainer } from 'unstated-next';
import { ListItemInterface } from '@Types';

import { useRequest } from 'ahooks';

const { useState, useEffect } = React;

declare var window: any;

const originData: Array<ListItemInterface> = remote.getGlobal('sharedObject').originData;

const AppArr: any = [
  {
    name: 'Apps',
    mode: 0,
    visible: false
  },
  {
    name: 'Search',
    mode: 1
  },
  {
    name: 'Zhihu Hot',
    mode: 2
  },
  {
    name: 'Music',
    mode: 3
  },
  {
    name: 'Douban Renting',
    mode: 4
  },
  {
    name: 'v2ex topics',
    mode: 5
  },
  {
    name: 'v2ex node',
    mode: 6,
    visible: false
  },
  {
    name: 'v2ex hot',
    mode: 7
  }
];

// const baseUrl = 'http://10.0.1.78:6085';
const baseUrl = 'http://localhost:6085';

type MCResultType = {
  mode: number,
  list: Array<any>
};

const ff = (url: string) => {
  return fetch(url)
    .then((res: any) => res.json())
    .then((r: any) => {
      if (r.Code === 0) {
        return r.list;
      } else {
        return [];
      }
    })
    .catch((e) => {
      console.log('ff error: ', e);
      return [];
    });
};

const handleSwitch = (mode: number, payload?: any) => {
  return new Promise(async (resolve) => {
    let r: MCResultType;
    let list: any;
    switch (mode) {
      case 0:
        r = {
          mode,
          list: AppArr.filter((item: any) => item.visible !== false)
        };
        break;
      case 1:
        r = {
          mode,
          list: originData
        };
        break;
      case 2:
        list = await ff(`${baseUrl}/api/v1/list/${0}/incognito`);
        r = { mode, list };
        break;
      case 3:
        r = { mode, list: [1, 2] };
        break;
      case 4:
        list = await ff(`${baseUrl}/api/v1/renting/${0}/`);
        r = { mode, list };
        break;
      case 5:
        list = await ff(`${baseUrl}/api/v1/v2ex/nodes/`);
        r = { mode, list };
        break;
      case 6:
        console.log('enter case 6', payload);
        list = await ff(`${baseUrl}/api/v1/v2ex/node/${payload.id}`);
        r = { mode, list };
        break;
      case 7:
        list = await ff(`${baseUrl}/api/v1/v2ex/hot/`);
        r = { mode, list };
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

const handleModeChange = (mode: number = 0, payload?: any): any => {
  return new Promise(async (resolve) => {
    let tmpMode = mode;

    if (tmpMode === AppArr.length) {
      tmpMode = 0;
    }

    let r = await handleSwitch(tmpMode, payload);
    resolve(r);
  });
};

const useAppHook = () => {
  const [value, setValue] = useState('');
  const [result, setResult] = useState([]);
  const [mode, setMode] = useState(0);

  const { data, error, loading, run } = useRequest(handleModeChange);

  useEffect(() => {
    setValue('');
    setResult([]);
    if (mode !== 6) {
      run(mode);
    }
  }, [mode]);

  const toNextMode = () => {
    let tmp = mode + 1;
    if (tmp === AppArr.length) {
      tmp = 0;
    }
    setMode(tmp);
  };

  const toModeZero = () => {
    setMode(0);
  };

  const getCurrentValue = () => {
    return mode;
  };

  const dispatch = (action: any) => {
    // console.log('dispatch: ', action);
    switch (action.type) {
      case 'toNextMode':
        toNextMode();
        break;
      case 'toModeZero':
        toModeZero();
        break;
      case 'save':
        setValue(action.payload.value);
        // setResult(action.payload.result);
        break;
      case 'saveResult':
        setResult(action.payload.result);
        break;
      case 'saveBoth':
        setValue(action.payload.value);
        setResult(action.payload.result);
        break;
      case 'toV2Node':
        setMode(6);
        run(6, {
          id: action.payload.id
        });
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
