import * as React from 'react';
import { ipcRenderer } from 'electron';
import { createContainer } from 'unstated-next';
import { ListItemType, DispatchActionType } from '@Types';

const { useState, useEffect } = React;

let originalData: Array<ListItemType> = [];

declare var window: any;

const useDataHook = () => {
  const [data, setData] = useState(originalData);
  const [dataGuarantee, setDataGuarantee] = useState(true);

  // for test
  useEffect(() => {
    window.d = data;
  }, [data]);

  useEffect(() => {
    const handleGet = (e: any, args: any) => {
      setData(args.data);
    };

    ipcRenderer.on('list-item-data', handleGet);

    ipcRenderer.send('get-list-item');

    return () => {
      ipcRenderer.removeListener('list-item-data', handleGet);
    };
  }, []);

  const dispatch = (action: DispatchActionType) => {
    switch (action.type) {
      case 'setData':
        setData(action.payload.data);
        setDataGuarantee(false);
        break;
      case 'setDataGuarantee':
        setDataGuarantee(action.payload.dataGuarantee);
        break;
      default:
        break;
    }
  };

  return { data, dataGuarantee, dispatch };
};

export default createContainer(useDataHook);
