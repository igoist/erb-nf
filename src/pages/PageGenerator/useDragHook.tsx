import * as React from 'react';

const { useEffect, useState, useRef } = React;

const useDragHook = (dispatch: any) => {
  const refBody = useRef();
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [xC, setXC] = useState(0);
  const [yC, setYC] = useState(0);

  useEffect(() => {
    const el: any = refBody.current;

    if (el) {
      const handleMouseMove = (e: any) => {
        setXC(e.clientX);
        setYC(e.clientY);
      };

      const handleMouseDown = (e: any) => {
        // console.log('mouse down', e);
        setX(e.clientX);
        setY(e.clientY);
        el.addEventListener('mousemove', handleMouseMove);
      };

      const handleMouseUp = (e: any) => {
        // console.log('mouse up', e);
        el.removeEventListener('mousemove', handleMouseMove);
        dispatch({
          type: 'ItemRelease'
        });
      };

      el.addEventListener('mousedown', handleMouseDown);
      el.addEventListener('mouseup', handleMouseUp);

      return () => {
        el.removeEventListener('mousedown', handleMouseDown);
        el.removeEventListener('mouseup', handleMouseUp);
        el.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [refBody.current]);

  return { x, y, xC, yC, refBody };
};

export default useDragHook;
