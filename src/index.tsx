import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
// import '../dist/css/main.css';
import { AppContainer } from 'react-hot-loader';

ReactDOM.render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept();
}
