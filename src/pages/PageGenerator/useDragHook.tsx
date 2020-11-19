import * as React from 'react';

type useDragHookPropsType = {
  // el?: any
};

const { useEffect, useState, useRef } = React;

const useDragHook = () => {
  const refEl = useRef();
  const [f, setF] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    const el: any = refEl.current;

    console.log('el change', !!el);
    console.log(refEl);
    if (el) {
      console.log('enter bind');

      const handleMouseDown = (e: any) => {
        console.log('mouse down', e);
        setF(true);
        setX(e.clientX);
        setY(e.clientY);
      };

      const handleMouseUp = (e: any) => {
        setF(false);
        console.log('mouse up', e);
      };

      el.addEventListener('mousedown', handleMouseDown);
      el.addEventListener('mouseup', handleMouseUp);

      return () => {
        el.removeEventListener('mousedown', handleMouseDown);
        el.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [refEl.current]);

  return { f, x, y, refEl };
};

export default useDragHook;
