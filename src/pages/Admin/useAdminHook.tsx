import * as React from 'react';
import { copy } from '@Utils';

const { useState } = React;
const { deepCopyOA } = copy;

let originalData = [
  {
    name: 'Zhihu',
    type: 'ScrollList',
    metas: {
      title: {
        dataIndex: 'title'
      },
      link: {
        dataIndex: 'link'
      }
    },
    locked: true
  }
];

type DispatchActionType = {
  type: string,
  payload?: any
};

// data = [...data, ...data, ...data, ...data, ...data];
// data = [...data, ...data, ...data];

const handleCopy = (d: any) => {
  let tmpArr: any = [];
  for (let i = 0; i < d.length; i++) {
    tmpArr.push(deepCopyOA(d[i]));
  }
  return tmpArr;
};

const useAdminHook = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [data, setData] = useState(originalData);
  // 0: normal & 1: add & 2: edit
  const [mode, setMode] = useState(0);

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
        // index for tmp
        setFormData({
          index: payload.index,
          name: item.name,
          type: item.type,
          title: item.metas.title.dataIndex,
          link: item.metas.link.dataIndex
        });
        setCreateModalVisible(true);
        break;
      case 'ItemAdd':
        setData([
          ...data,
          {
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
            locked: true
          }
        ]);
        break;
      case 'ItemEdit':
        data[payload.index] = {
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
          locked: true
        };

        setData(handleCopy(data)); // if not? tested
        break;
      case 'ItemDelete':
        setData(
          handleCopy(
            data.filter((item: any, index: number) => {
              return payload.index !== index;
            })
          )
        );
        break;
      case 'ItemLock':
        data[payload.index].locked = true;
        setData(handleCopy(data));
        break;
      case 'ItemUnlock':
        data[payload.index].locked = false;
        setData(handleCopy(data));
        break;
      case 'ClearFormData':
        setFormData({});
        break;
      case 'SetMode':
        setMode(payload.mode);
      default:
        break;
    }
  };

  return {
    createModalVisible,
    data,
    formData,
    mode,
    dispatch
  };
};

export default useAdminHook;
