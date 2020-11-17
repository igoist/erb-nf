import * as React from 'react';
import { ipcRenderer, remote } from 'electron';
import { createContainer } from 'unstated-next';
import { ListItemInterface, ListItemType } from '@Types';
import { useDataHook } from '@Models';

import { useRequest } from 'ahooks';

const { useState, useEffect } = React;

declare var window: any;

const originData: Array<ListItemInterface> = remote.getGlobal('sharedObject').originData;

// const baseUrl = 'http://10.0.1.78:6085';
const baseUrl = 'http://localhost:6085';

type MCResultType = {
  mode: number,
  list: Array<any>,
  page?: number,
  id?: number
};

const ff = (url: string) => {
  console.log('ff: ', url);
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

const handleSwitch = (mode: number, AppArr: Array<ListItemType>, payload: any = {}) => {
  const item = AppArr[mode];
  return new Promise(async (resolve) => {
    let r: MCResultType;
    let list: any;

    if (mode === -1) {
      r = {
        mode,
        list: AppArr.filter((item: any) => item.visible !== false)
      };
    } else if (item && item.name === 'v2ex Node') {
      // if (payload.id === undefined) {
      //   r = { mode, list: [] };
      // } else
      if (payload.page === undefined) {
        list = await ff(`${baseUrl}/api/v1/v2ex/node/${payload.id}/?page=1`);
        r = { mode, list, page: 1, id: payload.id };
      } else {
        list = await ff(`${baseUrl}/api/v1/v2ex/node/${payload.id}/?page=${payload.page}`);
        r = { mode, list, page: payload.page, id: payload.id };
      }
    } else if (item && item.type === 'ScrollList') {
      list = await ff(`${baseUrl}${item.api}`);
      r = { mode, list };
    } else {
      r = { mode, list: [] };
    }

    window.r = r;

    setTimeout(() => {
      resolve(r);
    }, 300);
  });
};

const handleModeChange = (mode: number = 0, AppArr: Array<ListItemType> = [], payload?: any): any => {
  return new Promise(async (resolve) => {
    let tmpMode = mode;

    let r = await handleSwitch(tmpMode, AppArr, payload);
    resolve(r);
  });
};

const useAppHook = () => {
  const [value, setValue] = useState('');
  const [result, setResult] = useState([]);
  const [mode, setMode] = useState(-1);
  const { data: AppArr } = useDataHook.useContainer();

  const { data, error, loading, run } = useRequest(handleModeChange, {
    // manual: true,
    // refreshDeps: [],
    throttleInterval: 300
  });

  useEffect(() => {
    console.log('AppHook AppArr change: ', AppArr);
    run(mode, AppArr);
  }, [AppArr]);

  useEffect(() => {
    setValue('');
    setResult([]);

    if (AppArr[mode] && AppArr[mode].name === 'v2ex Node') {
      console.log('should not do it automatically');
    } else if (mode === -1 || (AppArr[mode] && AppArr[mode].type === 'ScrollList')) {
      run(mode, AppArr);
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
    setMode(-1);
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
        break;
      case 'saveResult':
        setResult(action.payload.result);
        break;
      case 'saveBoth':
        setValue(action.payload.value);
        setResult(action.payload.result);
        break;
      case 'toV2Node':
        setMode(action.payload.mode);
        console.log('========== toV2Node: ', action.payload);
        run(action.payload.mode, AppArr, {
          id: action.payload.id
        });
        break;
      case 'toV2NodePage':
        console.log('========== toV2Page', action.payload);
        run(6, AppArr, {
          id: action.payload.id,
          page: action.payload.page
          // list: action.payload.list
        });
        break;
      default:
        break;
    }
  };

  return {
    AppArr,
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
    dispatch
  };
};

export default createContainer(useAppHook);
