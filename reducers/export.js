import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  formats: {
    csv: 'Comma Separated Value file (*.csv)',
    json: 'JSON file (*.json)'
  },
  selectedFormat: 'csv',
  columns: [ ],
  query: {
    size: 0,
    error: null
  }
};

export const exportReducer = createReducer(fromJS(initialState), {
  [constants.ADD_COLUMN]: (state, action) =>
    state.merge({
      columns: state.get('columns').unshift(fromJS(action.payload))
    }),
  [constants.FETCH_USER_COUNT_FULFILLED]: (state, action) =>
    state.merge({
      query: {
        size: action.payload.data.total
      }
    }),
  [constants.FETCH_USER_COUNT_REJECTED]: (state, action) =>
    state.merge({
      query: {
        error: action.payload
      }
    })
});
