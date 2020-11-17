import * as React from 'react';
import { ipcRenderer } from 'electron';
const { useEffect } = React;

const PG = () => {
  useEffect(() => {
    ipcRenderer.send('switch-pg', {
      flag: true
    });

    return () => {
      console.log('PG unmount');
      ipcRenderer.send('switch-pg', {
        flag: false
      });
    };
  }, []);

  return <div>XX</div>;
};

export default PG;
