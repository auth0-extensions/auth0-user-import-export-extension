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

export function updateSearchFilter(searchFilter) {
  return {
    type: constants.UPDATE_SEARCH_FILTER,
    payload: {
      searchFilter
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
        responseType: 'json'
      })
    }
  };
}

// function downloadUsers(settings, query, page = 1) {
//   let url = `https://${window.config.AUTH0_DOMAIN}/api/v2/users?per_page=100&page=${page}&search_engine=v2`;
//   if (settings.sortBy && settings.sortBy.length) {
//     url += `&sort=${settings.sortBy}:${settings.sortDesc ? -1 : 1}`;
//   } else {
//     url += '&sort=user_id:1';
//   }
//
//   return axios
//     .get(`${url}&q=${encodeURIComponent(query)}`, {
//       responseType: 'json'
//     })
//     .then(res =>
//        ({
//          res,
//          nextPage: page + 1
//        })
//     );
// }

function downloadUsers(settings, query, page = 1) {
  let url = `${window.config.BASE_URL}/api/users?page=${page}`;
  if (settings.sortBy && settings.sortBy.length) {
    url += `&sort=${settings.sortBy}:${settings.sortDesc ? -1 : 1}`;
  } else {
    url += '&sort=user_id:1';
  }

  return axios
    .get(`${url}&q=${encodeURIComponent(query)}`, {
      responseType: 'json'
    })
    .then(res =>
      ({
        res,
        nextPage: page + 1
      })
    );
}

export function closeExportDialog() {
  return {
    type: constants.CLOSE_EXPORT_DIALOG
  };
}

export function downloadUsersToFile(settings, columns, defaultColumns, items) {
  try {
    if (settings.format === 'json') {
      toJSON('export.json', columns, items);
    } else {
      toCSV('export.csv', columns && columns.length ? columns : defaultColumns, items);
    }

    return closeExportDialog();
  } catch (e) {
    return {
      type: constants.SAVE_USERS_REJECTED,
      payload: {
        error: `Mapping failed: ${e.message}. Please review your user attributes for possible errors.`
      }
    };
  }
}

export function exportUsers(query, settings) {
  return (dispatch, getState) => {
    // Start.
    dispatch({
      type: constants.EXPORT_USERS_STARTED
    });

    let page = 0;
    let items = [];
    let continueIn = 0;

    // Download everything.
    promiseWhile(() => continueIn,
      () => downloadUsers(settings, query, page).then(({ res, nextPage }) => {
        const data = (res && res.data) || {};

        if (data.limits && data.limits.remaining < 5) {
          // Pause downloading
          continueIn = 1000;
        } else if (data.limits && data.limits.remaining === 0) {
          const reset = (data.limits.reset + 1) * 1000;
          const now = new Date().getTime();
          continueIn = reset - now;
        } else {
          continueIn = 0;
        }

        if (!getState().export.get('process').get('started')) {
          continueIn = -1;
          return;
        }

        if (!data.users || !data.users.length) {
          continueIn = -1;
        } else {
          items = items.concat(data.users);
        }

        if (items.length >= constants.MAX_RECORDS) {
          items = items.slice(0, constants.MAX_RECORDS);
          continueIn = -1;
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
        if (!getState().export.get('process').get('started')) {
          return;
        }

        // Report progress.
        dispatch({
          type: constants.EXPORT_USERS_COMPLETE,
          payload: {
            items
          }
        });
      });
  };
}
