import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from '@Models';
import App from './App';
import '../dist/css/main.css';

ReactDOM.render(
  <AppContainer>
    <Provider>
      <App />
    </Provider>
  </AppContainer>,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept();
}
