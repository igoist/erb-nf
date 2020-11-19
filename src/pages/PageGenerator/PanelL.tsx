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

  return (
    <div className={`${prefix}-panel-l`}>
      <Button onClick={addDiv}>Add Div</Button>
    </div>
  );
};

export default PanelL;
