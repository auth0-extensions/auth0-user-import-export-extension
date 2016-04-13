import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  userProfile: { }
};

export const userReducer = createReducer(fromJS(initialState), {
  [constants.LOGIN_SUCCESS]: (state, action) =>
    state.merge({
      userProfile: action.payload.userProfile
    })
});
