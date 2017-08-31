import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  isAuthenticated: false,
  isAuthenticating: false,
  userProfile: { }
};

export const userReducer = createReducer(fromJS(initialState), {
  [constants.LOGIN_SUCCESS]: (state, action) =>
    state.merge({
      isAuthenticated: true,
      isAuthenticating: false,
      userProfile: action.payload.userProfile
    }),
  [constants.LOGIN_FAILED]: (state, action) =>
    state.merge({
      isAuthenticated: false,
      isAuthenticating: false,
      error: (action.payload && action.payload.error) || 'Unknown Error'
    })
});
