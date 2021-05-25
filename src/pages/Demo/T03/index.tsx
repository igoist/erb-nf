import * as React from 'react';
import { useImmer, useImmerReducer } from 'use-immer';

import AppUseImmer from './AppUseImmer';
import AppUseImmerReducer from './AppUseImmerReducer';
import AppUseArray from './AppUseArray';

const App = () => {
  return (
    <>
      <AppUseImmer />
      <AppUseImmerReducer />
      <AppUseArray />
    </>
  );
};

export default App;
