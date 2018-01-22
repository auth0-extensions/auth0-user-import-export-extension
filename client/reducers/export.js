import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  formats: {
    csv: 'Tab Separated Value file (*.csv)',
    json: 'JSON file (*.json)'
  },
  settings: {
    format: 'json'
  },
  fields: [ ],
  defaultFields: [
    { name: 'user_id', export_as: 'Id' },
    { name: 'given_name', export_as: 'Given Name' },
    { name: 'family_name', export_as: 'Family Name' },
    { name: 'nickname', export_as: 'Nickname' },
    { name: 'name', export_as: 'Name' },
    { name: 'email', export_as: 'Email' },
    { name: 'email_verified', export_as: 'Email Verified' },
    { name: 'picture', export_as: 'Picture' },
    { name: 'identities[0].connection', export_as: 'Connection' },
    { name: 'created_at', export_as: 'Created At' },
    { name: 'updated_at', export_as: 'Updated At' }
  ],
  query: {
    loading: true,
    size: 0,
    error: null,
    filter: null
  },
  process: {
    started: false,
    complete: false,
    total: 0,
    current: 0,
    items: [ ],
    error: null
  }
};

export const exportReducer = createReducer(fromJS(initialState), {
  [constants.UPDATE_SETTINGS]: (state, action) =>
    state.merge({
      settings: fromJS(action.payload.settings)
    }),
  [constants.UPDATE_SEARCH_FILTER]: (state, action) =>
    state.merge({
      query: state.get('query').merge({
        filter: action.payload.searchFilter
      })
    }),
  [constants.ADD_COLUMN]: (state, action) =>
    state.merge({
      fields: state.get('fields').push(fromJS(action.payload))
    }),
  [constants.REMOVE_COLUMN]: (state, action) => {
    const fields = state.get('fields');
    const index = fields.findIndex(c => c.get('_id') === action.payload._id);
    return state.merge({
      fields: fields.delete(index)
    });
  },
  [constants.FETCH_USER_COUNT_PENDING]: state =>
    state.merge({
      query: state.get('query').merge({
        loading: true,
        size: 0
      })
    }),
  [constants.FETCH_USER_COUNT_FULFILLED]: (state, action) =>
    state.merge({
      query: state.get('query').merge({
        loading: false,
        size: action.payload.data.total,
        hasUsers: action.payload.data.users && action.payload.data.users.length > 0
      })
    }),
  [constants.FETCH_USER_COUNT_REJECTED]: (state, action) =>
    state.merge({
      query: {
        loading: true,
        error: action.payload
      }
    }),
  [constants.CLOSE_EXPORT_DIALOG]: state =>
    state.merge({
      process: {
        started: false,
        current: 0
      }
    }),
  [constants.EXPORT_DOWNLOAD_FULFILLED]: state =>
    state.merge({
      process: {
        started: false,
        current: 0
      }
    }),
  [constants.EXPORT_USERS_STARTED]: state =>
    state.merge({
      process: {
        error: null,
        started: true,
        complete: false,
        current: 0
      }
    }),
  [constants.EXPORT_USERS_CANCEL]: state =>
    state.merge({
      process: {
        started: false,
        current: 0
      }
    }),
  [constants.EXPORT_USERS_PROGRESS]: (state, action) =>
    state.merge({
      process: {
        started: true,
        current: action.payload.percentage
      }
    }),
  [constants.EXPORT_USERS_COMPLETE]: (state, action) =>
    state.merge({
      process: {
        started: true,
        complete: true,
        jobId: action.payload.jobId,
        current: action.payload.percentage,
        link: action.payload.link
      }
    }),
  [constants.EXPORT_USERS_REJECTED]: (state, action) =>
    state.merge({
      process: {
        started: true,
        current: state.get('process').get('current'),
        error: action.payload.error.message || action.payload.error.message
      }
    }),
  [constants.SAVE_USERS_REJECTED]: (state, action) =>
    state.merge({
      process: {
        started: true,
        current: state.get('process').get('current'),
        error: action.payload.error
      }
    })
});
