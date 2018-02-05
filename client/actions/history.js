import axios from 'axios';
import uuid from 'node-uuid';
import * as constants from '../constants';
import promiseWhile from '../utils/promiseWhile';

export function fetchJobs() {
  return {
    type: constants.FETCH_JOBS_LIST,
    payload: {
      promise: axios.get('/api/history', {
        responseType: 'json'
      })
    }
  };
}
