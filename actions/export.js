import axios from 'axios';
import Promise from 'bluebird';
import uuid from 'node-uuid';
import * as constants from '../constants';
import filesaver from 'browser-filesaver';
import { toJSON } from '../utils/saveFile';

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

export function removeColumn(id) {
  return {
    type: constants.REMOVE_COLUMN,
    payload: {
      _id: id
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

function downloadUsers(query, page = 1) {
  return axios
    .get(`https://${window.config.AUTH0_DOMAIN}/api/v2/users?per_page=100&page=${page}&search_engine=v2&q=${encodeURIComponent(query)}`, {
      timeout: 5000,
      responseType: 'json'
    })
    .then(res => {
      return {
        res,
        nextPage: page + 1
      }
    });
}

const promiseWhile = Promise.method((condition, action) => {
  if (!condition()) {
    return null;
  }

  return action().then(promiseWhile.bind(null, condition, action));
});

export function exportUsers(query, columns) {
  return (dispatch) => {
    let end = false;
    let query = '';
    let page = 1;
    let arraySize = 0;
    let items = null;
   let  properties = {type: 'application/octet-stream'};

    promiseWhile(() => !end,
      () => downloadUsers(query, page).then(({ res, nextPage}) => {
        console.log(res);
        if (!res.data || !res.data.length) {
          end = true;
        }
else {
  items = res.data;
}
        arraySize += res.data.length;
        if (arraySize >= 400) {
          end = true;
        }
        page = nextPage;
      }))
      .then(() => {
        toJSON('export.json', columns, items);
      });
  }
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
