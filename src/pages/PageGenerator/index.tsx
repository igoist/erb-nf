import * as React from 'react';
import { ipcRenderer } from 'electron';
import W from './W';
import PanelL from './PanelL';
import PanelR from './PanelR';

const { useEffect } = React;

const PG = () => {
  useEffect(() => {
    ipcRenderer.send('change-win', {
      type: 'switch-pg',
      flag: true
    });

    return () => {
      console.log('PG unmount');
      ipcRenderer.send('change-win', {
        type: 'switch-pg',
        flag: false
      });
    };
  }, []);

  const parseProps = {
    prefix: 'pg'
  };

  return (
    <div className='pg-wrap no-webkit-drag'>
      <W {...parseProps} />

      <PanelL {...parseProps} />
      <PanelR {...parseProps} />
    </div>
  );
};

export default PG;

/**
 * 整体为一个序列对象
 *
 * 每个对象对应一个元素，有 style 属性
 *
 * PanelL 中放置按钮，点按添加元素
 *
 * Main 是显示区域，考虑选中之后其他的透明度？
 *
 * PanelR 负责显示选中元素的属性，可编辑
 */
