import * as React from 'react';

const { useState } = React;
/**
 * useModelVisible 返回以下内容
 * 状态 visible 是否可见
 * 函数 closeModel、openModel 控制是否可见
 */
const useModelVisible = () => {
  const [visible, setVisible] = useState(false);

  const closeModel = () => {
    setVisible(false);
  };

  const openModel = () => {
    setVisible(true);
  };

  return { visible, closeModel, openModel };
};

export default useModelVisible;
