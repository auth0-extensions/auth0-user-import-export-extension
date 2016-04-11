import axios from 'axios';
import * as constants from '../constants';

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
