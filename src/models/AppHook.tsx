import * as React from 'react';
import { ipcRenderer, remote } from 'electron';
import { createContainer } from 'unstated-next';
import { ListItemInterface } from '../Interfaces';

const { useState } = React;

declare var window: any;

let locked: boolean = false;

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
  }
];

const baseUrl = 'http://10.0.1.78:6085';

const ff = () => {
  return fetch(`${baseUrl}/api/v1/list/${0}`)
    .then((res: any) => res.json())
    .then((r) => {
      if (r.Code === 0) {
        return {
          mode: 2,
          data: r.list
        };
      } else {
        return {
          mode: 2,
          data: []
        };
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

const handleLocked = (l: boolean) => {
  locked = l;
};

const handleSwitch = (mode: number) => {
  handleLocked(true);

  return new Promise(async (resolve) => {
    let r;
    switch (mode) {
      case 0:
        r = {
          mode,
          data: AppArr
        };
        break;
      case 1:
        r = {
          mode,
          data: originData
        };
        break;
      case 2:
        r = await ff();
        break;
      default:
        r = {
          mode,
          data: originData
        };
        break;
    }

    window.r = r;
    handleLocked(false);
    resolve(r);
  });
};

const handleModeChange = (mode: number, flag?: boolean) => {
  return new Promise(async (resolve) => {
    if (locked) {
      console.log('want to change: ', mode);
      resolve(false);
    } else {
      let newMode;

      if (flag) {
        newMode = mode;
      } else {
        newMode = mode + 1;
      }

      if (newMode === AppArr.length) {
        newMode = 0;
      }

      let r = await handleSwitch(newMode);
      resolve(r);
    }
  });
};

const useAppHook = () => {
  const [value, setValue] = useState('');
  const [data, setData] = useState(AppArr);
  const [result, setResult] = useState([]);
  const [mode, setMode] = useState(0);

  const toMode = async (newMode: number) => {
    const handled: any = await handleModeChange(newMode, true);
    if (handled) {
      setData(handled.data);
      setMode(handled.mode);
    }
  };

  const toNextMode = async () => {
    const handled: any = await handleModeChange(mode);
    if (handled) {
      setData(handled.data);
      setMode(handled.mode);
    }
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
    data,
    setData,
    result,
    setResult,
    mode,
    setMode,
    toMode,
    toNextMode,
    getCurrentValue,
    dispatch
  };
};

const AppHook = createContainer(useAppHook);

export default AppHook;

export { AppArr };
