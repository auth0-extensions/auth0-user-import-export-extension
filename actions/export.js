import axios from 'axios';
import uuid from 'node-uuid';
import * as constants from '../constants';
import promiseWhile from '../utils/promiseWhile';
import { toJSON, toCSV } from '../utils/saveFile';

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

export function updateSettings(settings) {
  return {
    type: constants.UPDATE_SETTINGS,
    payload: {
      settings
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

function downloadUsers(settings, query, page = 1) {
  console.log(settings);
  let url = `https://${window.config.AUTH0_DOMAIN}/api/v2/users?per_page=100&page=${page}&search_engine=v2`;
  if (settings.sortBy && settings.sortBy.length) {
    url += `&sort=${settings.sortBy}:${settings.sortDesc ? -1 : 1}`;
  }

  return axios
    .get(`${url}&q=${encodeURIComponent(query)}`, {
      timeout: 5000,
      responseType: 'json'
    })
    .then(res => {
      return {
        res,
        nextPage: page + 1
      };
    });
}

export function exportUsers(query, settings, columns, defaultColumns) {
  return (dispatch) => {
    // Start.
    dispatch({
      type: constants.EXPORT_USERS_STARTED
    });

    let page = 0;
    let items = [];
    let stopped = false;

    // Download everything.
    promiseWhile(() => !stopped,
      () => downloadUsers(settings, query, page).then(({ res, nextPage }) => {
        if (!res.data || !res.data.length) {
          stopped = true;
        } else {
          items = items.concat(res.data);
        }

        if (items.length >= 100000) {
          items = items.slice(0, 100000);
          stopped = true;
        }

        // Report progress.
        dispatch({
          type: constants.EXPORT_USERS_PROGRESS,
          payload: {
            count: items.length
          }
        });

        // Continue.
        page = nextPage;
      }))
      .then(() => {
        // Report progress.
        dispatch({
          type: constants.EXPORT_USERS_COMPLETE
        });

        // Save.
        if (settings.format === 'json') {
          toJSON('export.json', columns, items);
        } else {
          toCSV('export.csv', columns && columns.length ? columns : defaultColumns, items);
        }
      });
  };
}
