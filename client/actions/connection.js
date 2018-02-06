import axios from 'axios';
import * as constants from '../constants';

/*
 * Load all connections available in the Auth0 account.
 */
export function fetchConnections(fetchAll) {
  let url = `${window.config.BASE_URL}/api/connections`;

  if (!fetchAll) {
    url += '?strategy=auth0';
  }

  return {
    type: constants.FETCH_CONNECTIONS,
    payload: {
      promise: axios.get(url, {
        timeout: 10000,
        responseType: 'json'
      })
    }
  };
}
