import _ from 'lodash';
import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  records: [],
  error: null
};

export const historyReducer = createReducer(fromJS(initialState), {
  [constants.FETCH_JOBS_LIST_PENDING]: state =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.FETCH_JOBS_LIST_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: 'An error occurred while getting jobs history: ' +
      (action.payload.response && action.payload.response.data && action.payload.response.data.message) || action.payload.message || action.payload.statusText
    }),
  [constants.FETCH_JOBS_LIST_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      error: null,
      records: fromJS(action.payload && action.payload.data && action.payload.data.jobs)
    }),
  [constants.CHECK_JOB_STATUS_PENDING]: state =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.CHECK_JOB_STATUS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: 'An error occurred while getting jobs status: ' +
      (action.payload.response && action.payload.response.data && action.payload.response.data.message) || action.payload.message || action.payload.statusText
    }),
  [constants.CHECK_JOB_STATUS_FULFILLED]: (state, action) => {
    const { id, status, summary } = action.payload.data;
    const records = state.get('records').toJS();
    const jobIndex = _.findIndex(records, { id });
    records[jobIndex].status = status;
    records[jobIndex].summary = summary || {};

    return state.merge({
      loading: false,
      error: null,
      records
    });
  }
});
