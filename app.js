import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createHistory } from 'history'
import { useRouterHistory } from 'react-router'
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';

import routes from './routes';
import configureStore from './store/configureStore';

// Make history aware of the base path.
const history = useRouterHistory(createHistory)({
  basename: window.config.BASE_PATH || ''
});
const store = configureStore([ routerMiddleware(history) ], { });
const reduxHistory = syncHistoryWithStore(history, store);

// Fire first events.
store.dispatch(loadCredentials());

// Render application.
ReactDOM.render(
  <Provider store={store}>
    {routes(reduxHistory)}
  </Provider>,
  document.getElementById('app')
);

// Show the developer tools.
if (process.env.NODE_ENV !== 'production') {
  const showDevTools = require('./showDevTools');
  showDevTools(store);
}
