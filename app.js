import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import { push } from 'react-router-redux';
import { Provider } from 'react-redux';
import { createHistory } from 'history';
import { useRouterHistory } from 'react-router';
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';

import routes from './routes';
import { authActions } from './actions';
import configureStore from './store/configureStore';

// Make history aware of the base path.
const history = useRouterHistory(createHistory)({
  basename: window.config.BASE_PATH || ''
});
const store = configureStore([ routerMiddleware(history) ], { });
const reduxHistory = syncHistoryWithStore(history, store);

// Fire first events.
const accessToken = sessionStorage.getItem('token');
axios.interceptors.request.use((config) => {
  if (config.url.indexOf(window.config.AUTH0_DOMAIN) > 0) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else if (config.url.indexOf(window.config.BASE_URL) === 0) {
    config.headers['X-Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});
store.dispatch(authActions.login(accessToken));
store.dispatch(push('/import'));

// Render application.
ReactDOM.render(
  <Provider store={store}>
    {routes(reduxHistory)}
  </Provider>,
  document.getElementById('app')
);

// Show the developer tools.
if (process.env.NODE_ENV !== 'production') {
  const showDevTools = require('./utils/showDevTools');
  showDevTools(store);
}
