import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import { exportReducer } from './export';
import { importReducer } from './import';

export default combineReducers({
  routing: routerReducer,
  importReducer,
  exportReducer,
  form: formReducer
});
