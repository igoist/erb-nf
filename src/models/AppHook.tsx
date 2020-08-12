import * as React from 'react';
import { remote } from 'electron';
import { createContainer } from 'unstated-next';
import { ListItemInterface } from '../Interfaces';

const { useState } = React;

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
    name: 'Music',
    mode: 2
  }
];

const handleSwitch = (mode: number) => {
  switch (mode) {
    case 0:
      return {
        mode,
        data: AppArr
      };
    case 1:
      return {
        mode,
        data: originData
      };
    default:
      return {
        mode,
        data: originData
      };
  }
}

const handleModeChange = (mode: number) => {
  let newMode = mode + 1;
  if (newMode === AppArr.length) {
    newMode = 0;
  }
  return handleSwitch(newMode);
};


const useAppHook = () => {
  const [value, setValue] = useState('');
  const [data, setData] = useState(AppArr);
  const [result, setResult] = useState([]);
  const [mode, setMode] = useState(0);

  React.useEffect(() => {
    console.log('mode change: ', mode);
  }, [mode]);

  const toNextMode = () => {
    const handled = handleModeChange(mode);
    console.log('toNextMode: ', mode, handled.mode, handled);
    setData(handled.data);
    setMode(handled.mode);
  };

  // let [count, setCount] = useState(0);

  const getCurrentValue = () => {
    console.log(mode);
    return mode;
  };

  const dispatch = (action: any) => {
    switch(action.type) {
      case 'toNextMode':
        toNextMode();
        break;
      default:
        break;
    }
  };

  return {
    value, setValue,
    data, setData,
    result, setResult,
    mode, setMode,
    toNextMode,
    getCurrentValue,
    dispatch
  }
};

const AppHook = createContainer(useAppHook);

export default AppHook;
