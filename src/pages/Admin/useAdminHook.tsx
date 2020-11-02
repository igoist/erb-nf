import * as React from 'react';
import { copy } from '@Utils';
import { ipcRenderer } from 'electron';
import { DispatchActionType, ListItemType } from '@Types';
import { message } from 'antd';

import { useDataHook } from '@Models';

const { useState, useEffect } = React;
const { deepCopyOA } = copy;

const handleCopy = (d: any) => {
  let tmpArr: any = [];
  for (let i = 0; i < d.length; i++) {
    tmpArr.push(deepCopyOA(d[i]));
  }
  return tmpArr;
};

type MSGType = {
  status: string,
  msg: string
};

const returnNewItem = (payload: any) => {
  return {
    id: payload.id,
    index: payload.index,
    name: payload.name,
    type: payload.type,
    metas: {
      title: {
        dataIndex: payload.title
      },
      link: {
        dataIndex: payload.link
      }
    },
    api: payload.api,
    locked: true,
    visible: payload.visible
  };
};

const useAdminHook = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const { data, dataGuarantee, dispatch: useDataDispatch } = useDataHook.useContainer();
  // 0: normal & 1: add & 2: edit
  const [mode, setMode] = useState(0);

  useEffect(() => {
    const handleMessage = (e: any, args: MSGType) => {
      if (args.status === 'success') {
        message.success(args.msg);
      }
      if (args.status === 'error') {
        message.error(args.msg);
      }
    };

    ipcRenderer.on('message-done', handleMessage);

    return () => {
      ipcRenderer.removeListener('message-done', handleMessage);
    };
  }, []);

  const dispatch = (action: DispatchActionType) => {
    const { payload } = action;

    switch (action.type) {
      case 'ModalVisible':
        setCreateModalVisible(payload.visible);
        break;
      case 'OpenItemEditModal':
        let item = data.filter((item: any, index: number) => {
          return payload.index === index;
        })[0];

        setFormData({
          api: item.api,
          id: item.id,
          index: payload.index,
          name: item.name,
          type: item.type,
          title: item.metas.title.dataIndex,
          link: item.metas.link.dataIndex,
          visible: item.visible
        });
        setCreateModalVisible(true);
        break;
      case 'ItemAdd':
        let newItem: ListItemType = returnNewItem(payload);
        useDataDispatch({
          type: 'setData',
          payload: {
            data: [...data, newItem]
          }
        });
        break;
      case 'ItemEdit':
        data[payload.index] = returnNewItem(payload);

        useDataDispatch({
          type: 'setData',
          payload: {
            data: handleCopy(data)
          }
        });
        break;
      case 'ItemDelete':
        useDataDispatch({
          type: 'setData',
          payload: {
            data: handleCopy(
              data.filter((item: any, index: number) => {
                return payload.index !== index;
              })
            )
          }
        });
        break;
      case 'ItemLock':
        data[payload.index].locked = true;
        useDataDispatch({
          type: 'setData',
          payload: {
            data: handleCopy(data)
          }
        });
        break;
      case 'ItemUnlock':
        data[payload.index].locked = false;
        useDataDispatch({
          type: 'setData',
          payload: {
            data: handleCopy(data)
          }
        });
        break;
      case 'ClearFormData':
        setFormData({});
        break;
      case 'SetMode':
        setMode(payload.mode);
        break;
      case 'SaveData':
        ipcRenderer.send('save-list-item', {
          data
        });
        useDataDispatch({
          type: 'setDataGuarantee',
          payload: {
            dataGuarantee: true
          }
        });
        break;
      default:
        break;
    }
  };

  return {
    createModalVisible,
    data,
    dataGuarantee,
    formData,
    mode,
    dispatch
  };
};

export default useAdminHook;
