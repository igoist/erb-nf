import * as React from 'react';
import { DispatchActionType } from '@Types';
import useDragHook from './useDragHook';
import * as utils from '@Utils';

const { deepCopyOA } = utils.copy;

const { useEffect, useState } = React;

type ItemType = {
  id: number,
  type: string,
  style: any
};

const inititalData: Array<ItemType> = [
  {
    id: 0,
    type: 'div',
    style: {
      top: 300,
      left: 700,
      width: 100,
      height: 50,
      backgroundColor: '#000'
    }
  },
  {
    id: 1,
    type: 'div',
    style: {
      top: 400,
      left: 0,
      width: 100,
      height: 50,
      backgroundColor: '#000'
    }
  }
];

const usePGHook = () => {
  const [data, setData] = useState(inititalData);
  const [id, setId] = useState(-1);
  const [coordinate, setCoordinate] = useState({ x: 0, y: 0 });

  const dispatch = (action: DispatchActionType) => {
    let tmp: any;
    switch (action.type) {
      case 'ItemSelected':
        let item = data.filter((item) => item.id === action.payload.id)[0];
        setId(action.payload.id);
        setCoordinate({
          x: item.style.left || 0,
          y: item.style.top || 0
        });
        break;
      case 'ItemRelease':
        console.log('enter release');
        setId(-1);
        break;
      case 'ItemMove':
        tmp = data.map((item: ItemType) => {
          if (item.id === id) {
            item.style.top = action.payload.top;
            item.style.left = action.payload.left;
          }

          return deepCopyOA(item);
        });

        setData(tmp);
        break;
      case 'AddDiv':
        tmp = [];
        for (let i = 0; i < data.length; i++) {
          tmp.push(deepCopyOA(data[i]));
        }

        tmp.push({
          id: data[data.length - 1].id + 1,
          type: 'div',
          style: {
            top: 100,
            left: 0,
            width: 100,
            height: 100,
            backgroundColor: '#000'
          }
        });

        setData(tmp);
      default:
        break;
    }
  };

  const { x, y, xC, yC, refBody } = useDragHook(dispatch);

  useEffect(() => {
    if (id !== -1) {
      let item = data.filter((item) => item.id === id)[0];
      // console.log(
      //   `xC: ${xC}, yC: ${yC}, top: ${item.style.top}, left: ${item.style.left}, l: ${item.style.left + xC - x}, t: ${
      //     item.style.top + yC - y
      //   }, x: ${x}, y: ${y}`
      // );
      dispatch({
        type: 'ItemMove',
        payload: {
          top: coordinate.y + yC - y,
          left: coordinate.x + xC - x
        }
      });
    }
  }, [xC, yC]);

  return { data, id, refBody, dispatch };
};

export default usePGHook;
