import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  files: [],
  error: null,
  validationErrors: [],
  connectionId: null,
  currentJob: null,
  currentJobIndex: -1
};

export const importReducer = createReducer(fromJS(initialState), {
  [constants.DROPPED_FILES]: (state, action) =>
  state.merge({
    loading: false,
    files: action.payload.files
  }),
  [constants.REMOVE_FILE]: (state, action) =>
  state.merge({
    files: action.payload.files
  }),
  [constants.IMPORT_USERS_PENDING]: state =>
    state.merge({
      loading: true,
      error: null,
      errorCode: null
    }),
  [constants.IMPORT_USERS_REJECTED]: (state, action) =>
    state.merge({
      currentJob: null,
      currentJobIndex: -1,
      currentConnectionId: state.toJS().connectionId,
      currentConnectionName: action.meta.connection.name,
      loading: false,
      errorCode: action.payload.response && action.payload.response.data && action.payload.response.data.errorCode,
      error: 'An error occured while uploading the file: ' +
      `${action.payload.message === 'Network Error' ? 'Verify the size of your upload and make sure the connection is enabled.' : ((action.payload.response && action.payload.response.data && action.payload.response.data.message) || action.payload.message || action.payload.statusText)}`
    }),
  [constants.IMPORT_USERS_FULFILLED]: (state, action) => {
    const updatedFiles = [];
    const currentJob = fromJS(action.payload.data);
    const currentJobIndex = state.get('currentJobIndex');
    let loading = true;
    let newCurrentJob = null;
    state.get('files').toJS().map((file, index) => {
      if (currentJob && currentJobIndex > -1 && index === currentJobIndex) {
        loading = false;
        file.status = currentJob.get('status');
        file.id = currentJob.get('id');
        newCurrentJob = file;
      }

      updatedFiles.push(file);
    });

    return state.merge({
      loading,
      files: fromJS(updatedFiles),
      currentJob: fromJS(newCurrentJob),
      currentJobIndex: -1
    });
  },
  [constants.CANCEL_IMPORT]: state =>
    state.merge({
      ...initialState
    }),
  [constants.CLEAR_IMPORT]: state =>
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
  [constants.DISMISS_ERROR]: state =>
    state.merge({
      loading: false,
      error: null,
      validationErrors: []
    }),
  [constants.PROBE_IMPORT_STATUS_PENDING]: state =>
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
  [constants.PROBE_IMPORT_STATUS_FULFILLED]: (state, action) => {
    const job = fromJS(action.payload.data);
    const updatedFiles = [];
    state.get('files').toJS().map((file) => {
      if (file.id === action.meta.currentJobId) {
        file.status = job.get('status');
        file.summary = job.get('summary');
      }
      updatedFiles.push(file);
    });

    return state.merge({
      loading: false,
      files: fromJS(updatedFiles),
      currentJob: null,
      currentJobIndex: -1
    });
  },
  [constants.SET_CURRENT_JOB]: (state, action) =>
    state.merge({
      connectionId: action.payload.connectionId,
      currentJob: fromJS(action.payload.currentJob),
      currentJobIndex: fromJS(action.payload.currentJobIndex)
    })
});
