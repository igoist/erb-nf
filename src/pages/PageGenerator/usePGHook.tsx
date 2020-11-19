import * as React from 'react';
import { DispatchActionType } from '@Types';
import useDragHook from './useDragHook';

const { useEffect, useState } = React;

const usePGHook = () => {
  const [id, setId] = useState(-1);
  const { refEl } = useDragHook();

  useEffect(() => {}, []);

  const dispatch = (action: DispatchActionType) => {
    switch (action.type) {
      case 'ItemSelected':
        setId(action.payload.id);
      default:
        break;
    }
  };

  return { id, refEl, dispatch };
};

export default usePGHook;
