import axios from 'axios';
import * as constants from '../constants';

export function fetchJobs() {
  return {
    type: constants.FETCH_JOBS_LIST,
    payload: {
      promise: axios.get(`${window.config.BASE_URL}/api/history`, {
        responseType: 'json'
      })
    }
  };
}

export function checkJobStatus(id, download) {
  return (dispatch) => {
    dispatch({
      type: constants.CHECK_JOB_STATUS,
      payload: {
        promise: axios.get(`${window.config.BASE_URL}/api/jobs/${id}`, {
          responseType: 'json'
        })
      },
      meta: {
        onSuccess: (payload) => {
          if (download && payload && payload.data && payload.data.status === 'completed' && payload.data.location) {
            window.location =  payload.data.location;
          }
        }
      }
    });
  }
}
