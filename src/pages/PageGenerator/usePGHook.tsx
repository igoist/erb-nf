import * as React from 'react';
import { DispatchActionType } from '@Types';
import useDragHook from './useDragHook';
import * as utils from '@Utils';

const { deepCopyOA } = utils.copy;

const { useEffect, useState } = React;

const inititalData = [
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
  const { x, y, xC, yC, refBody } = useDragHook();

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

  const dispatch = (action: DispatchActionType) => {
    switch (action.type) {
      case 'ItemSelected':
        let item = data.filter((item) => item.id === action.payload.id)[0];
        setId(action.payload.id);
        setCoordinate({
          x: item.style.left || 0,
          y: item.style.top || 0
        });
        break;
      case 'ItemMove':
        let tmp: any = data.map((item: any) => {
          if (item.id === id) {
            item.style.top = action.payload.top;
            item.style.left = action.payload.left;
          }

          return deepCopyOA(item);
        });

        setData(tmp);
        break;
      default:
        break;
    }
  };

  return { data, id, refBody, dispatch };
};

export default usePGHook;
