import axios from 'axios';
import uuid from 'node-uuid';
import * as constants from '../constants';

export function addColumn(userAttribute, columnName) {
  return {
    type: constants.ADD_COLUMN,
    payload: {
      _id: uuid.v4(),
      userAttribute,
      columnName
    }
  };
}

export function getUserCount(query = '') {
  return {
    type: constants.FETCH_USER_COUNT,
    payload: {
      promise: axios.get(`https://${window.config.AUTH0_DOMAIN}/api/v2/users?per_page=1&page=1&include_totals=true&search_engine=v2&q=${encodeURIComponent(query)}`, {
        timeout: 5000,
        responseType: 'json'
      })
    }
  };
}

export function doSomething() {
  return {
    type: constants.DO_SOMETHING,
    payload: {
      promise: axios.get('/api/do_something', {
        timeout: 5000,
        responseType: 'json'
      })
    }
  };
}
