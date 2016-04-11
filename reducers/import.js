import moment from 'moment';
import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false
};

export const importReducer = createReducer(fromJS(initialState), {
  [constants.DO_SOMETHING]: (state, action) =>
    state.merge({
      loading: true
    })
});
