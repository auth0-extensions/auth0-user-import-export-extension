import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  importErrors: null,
  reportJobId: null
};

export const reportReducer = createReducer(fromJS(initialState), {
  [constants.GET_JOB_REPORT_PENDING]: state =>
    state.merge({
      loading: true,
      error: null,
      importErrors: null
    }),
  [constants.GET_JOB_REPORT_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while trying to get the status of the job: ${action.payload.message || action.payload.statusText}`,
      importErrors: null
    }),
  [constants.GET_JOB_REPORT_FULFILLED]: (state, action) => {
    return state.merge({
      loading: false,
      error: null,
      importErrors: action.payload.data
    });
  },
  [constants.SHOW_JOB_REPORT]: (state, action) => {
    return state.merge({
      reportJobId: action.payload.jobId
    });
  },
  [constants.HIDE_JOB_REPORT]: (state) => {
    return state.merge({
      reportJobId: null
    });
  }
});
