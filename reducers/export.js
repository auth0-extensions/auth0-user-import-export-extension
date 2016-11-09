import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  formats: {
    csv: 'Tab Separated Value file (*.csv)',
    json: 'JSON file (*.json)'
  },
  settings: {
    sortBy: null,
    sortDesc: false,
    format: 'json'
  },
  columns: [ ],
  defaultColumns: [
    { userAttribute: 'user.user_id', columnName: 'Id' },
    { userAttribute: 'user.given_name', columnName: 'Given Name' },
    { userAttribute: 'user.family_name', columnName: 'Family Name' },
    { userAttribute: 'user.nickname', columnName: 'Nickname' },
    { userAttribute: 'user.name', columnName: 'Name' },
    { userAttribute: 'user.email', columnName: 'Email' },
    { userAttribute: 'user.email_verified', columnName: 'Email Verified' },
    { userAttribute: 'user.picture', columnName: 'Picture' },
    { userAttribute: 'user.identities[0].connection', columnName: 'Connection' },
    { userAttribute: 'user.created_at', columnName: 'Created At' },
    { userAttribute: 'user.updated_at', columnName: 'Updated At' }
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
      columns: state.get('columns').push(fromJS(action.payload))
    }),
  [constants.REMOVE_COLUMN]: (state, action) => {
    const columns = state.get('columns');
    const index = columns.findIndex((c) => c.get('_id') === action.payload._id);
    return state.merge({
      columns: columns.delete(index)
    });
  },
  [constants.FETCH_USER_COUNT_PENDING]: (state) =>
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
        size: action.payload.data.total
      })
    }),
  [constants.FETCH_USER_COUNT_REJECTED]: (state, action) =>
    state.merge({
      query: {
        loading: true,
        error: action.payload
      }
    }),
  [constants.CLOSE_EXPORT_DIALOG]: (state) =>
    state.merge({
      process: {
        started: false,
        current: 0
      }
    }),
  [constants.EXPORT_USERS_STARTED]: (state) =>
    state.merge({
      process: {
        error: null,
        started: true,
        complete: false,
        current: 0
      }
    }),
  [constants.EXPORT_USERS_CANCEL]: (state) =>
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
        current: action.payload.count
      }
    }),
  [constants.EXPORT_USERS_COMPLETE]: (state, action) =>
    state.merge({
      process: {
        started: true,
        complete: true,
        current: state.get('process').get('current'),
        items: action.payload.items
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
