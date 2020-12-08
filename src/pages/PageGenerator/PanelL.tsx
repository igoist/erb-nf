import * as React from 'react';
import { Button } from 'antd';

const PanelL = (props: any) => {
  const { prefix } = props;
  const { data, id, refBody, dispatch } = props;

  const addDiv = () => {
    dispatch({
      type: 'AddDiv'
    });
  };

  const storeData = () => {
    dispatch({
      type: 'StoreData'
    });
  };

  const getStoreData = () => {
    dispatch({
      type: 'GetStoreData'
    });
  };

  return (
    <div className={`${prefix}-panel-l`}>
      <Button onClick={addDiv}>Add Div</Button>
      <Button onClick={storeData}>Store Data</Button>
      <Button onClick={getStoreData}>Get Store Data</Button>
    </div>
  );
};

export default PanelL;
