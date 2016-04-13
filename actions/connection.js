import axios from 'axios';
import * as constants from '../constants';

/*
 * Load all connections available in the Auth0 account.
 */
export function fetchConnections() {
  return {
    type: constants.FETCH_CONNECTIONS,
    payload: {
      promise: axios.get(`https://${window.config.AUTH0_DOMAIN}/api/v2/connections?strategy=auth0`, {
        timeout: 10000,
        responseType: 'json'
      })
    }
  };
}
