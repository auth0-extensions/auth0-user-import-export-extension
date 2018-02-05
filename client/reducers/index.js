import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import { connectionReducer } from './connection';
import { historyReducer } from './history';
import { exportReducer } from './export';
import { importReducer } from './import';
import { reportReducer } from './report';
import { userReducer } from './user';

export default combineReducers({
  routing: routerReducer,
  connection: connectionReducer,
  import: importReducer,
  export: exportReducer,
  history: historyReducer,
  report: reportReducer,
  user: userReducer,
  form: formReducer
});
