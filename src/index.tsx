import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { AppHook } from '@Models';
import App from './App';
import '../dist/css/main.css';

ReactDOM.render(
  <AppContainer>
    <AppHook.Provider>
      <App />
    </AppHook.Provider>
  </AppContainer>,
  document.getElementById('app')
);


if (module.hot) {
  module.hot.accept();
}
