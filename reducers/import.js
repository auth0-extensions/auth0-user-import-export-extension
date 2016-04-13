import moment from 'moment';
import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  files: [],
  error: null,
  validationErrors: [],
  currentJob: null,
  currentJobIndex: -1
};

export const importReducer = createReducer(fromJS(initialState), {
  [constants.IMPORT_USERS_PENDING]: (state, action) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.IMPORT_USERS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while importing users: ${action.payload.message || action.payload.statusText}`
    }),
  [constants.IMPORT_USERS_FULFILLED]: (state, action) => {
    let currentJob = fromJS(action.payload.data);
    let currentJobIndex = state.get('currentJobIndex');
    let updatedFiles = [];
    let loading = true;
    state.get('files').map((file, index) => {
      if (currentJob && currentJobIndex > -1 && index === currentJobIndex) {
        loading = false;
        file.status = currentJob.get('status');
        updatedFiles.push(file);
      }
    });
    return state.merge({
      loading: loading,
      files: updatedFiles
    });
  },
  [constants.CANCEL_IMPORT]: (state, action) =>
    state.merge({
      ...initialState
    }),
  [constants.CLEAR_IMPORT]: (state, action) =>
    state.merge({
      ...initialState
    }),
  [constants.FORM_VALIDATION_FAILED]: (state, action) =>
    state.merge({
      loading: false,
      error: action.payload.error
    }),
  [constants.IMPORT_USERS_VALIDATION_FAILED]: (state, action) =>
    state.merge({
      loading: false,
      validationErrors: action.payload.validationErrors,
      files: action.payload.files,
      error: 'Validation error'
    }),
  [constants.DROPPED_FILES]: (state, action) =>
    state.merge({
      loading: false,
      files: action.payload.files
    }),
  [constants.REMOVE_FILE]: (state, action) =>
    state.merge({
      files: action.payload.files
    }),
  [constants.DISMISS_ERROR]: (state, action) =>
    state.merge({
      error: null,
      validationErrors: []
    }),
  [constants.PROBE_IMPORT_STATUS_PENDING]: (state, action) =>
    state.merge({
      loading: true,
      error: null,
      validationErrors: []
    }),
  [constants.PROBE_IMPORT_STATUS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while trying to get the status of the import job: ${action.payload.message || action.payload.statusText}`
    }),
  [constants.PROBE_IMPORT_STATUS_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      error: null,
      currentJob: currentJob,
      files: updatedFiles
    }),
  [constants.SET_CURRENT_JOB]: (state, action) =>
    state.merge({
      currentJob: fromJS(action.payload.currentJob),
      currentJobIndex: fromJS(action.payload.currentJobIndex)
    })
});
