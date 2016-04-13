import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import { exportReducer } from './export';
import { importReducer } from './import';
import { userReducer } from './user';

export default combineReducers({
  routing: routerReducer,
  import: importReducer,
  export: exportReducer,
  user: userReducer,
  form: formReducer
});
