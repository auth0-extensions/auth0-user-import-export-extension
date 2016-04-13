import axios from 'axios';
import * as constants from '../constants';

/*
 * Get the status of a job.
 */
export function probeImportStatus() {
  return (dispatch, getState) => {
    console.log(getState().import.toJS())
    const currentJob = getState().import.toJS().currentJob;

    if (currentJob && currentJob.id) {
      dispatch({
        type: constants.PROBE_IMPORT_STATUS,
        payload: {
          promise: axios.get(`https://${window.config.AUTH0_DOMAIN}/api/v2/jobs/${currentJob.id}`, {
            timeout: 10000,
            responseType: 'json'
          })
        }
      });
    }
  };
}

/*
 * Import a file of users to a specific connection.
 */
export function importUsers(formData, jobIndex) {
  if (!formData.connection_id || !formData.users) {
    return {
      type: constants.FORM_VALIDATION_FAILED,
      payload: {
        error: 'Please provide a file and a connection_id'
      }
    };
  }

  return (dispatch) => {
    dispatch({
      type: constants.SET_CURRENT_JOB,
      payload: {
        currentJob: formData.users,
        currentJobIndex: jobIndex
      }
    });

    dispatch({
      type: constants.IMPORT_USERS,
      payload: {
        promise: axios.post(`${window.config.BASE_URL}/users-import`, {
          data: formData,
          timeout: 5000,
          responseType: 'json'
        })
      }
    });
  };
}

/*
 * Cancel any pending jobs and clear form.
 */
export function clearForm() {
  return (dispatch) => {
    dispatch({
      type: constants.CANCEL_IMPORT
    });

    dispatch({
      type: constants.CLEAR_IMPORT
    });
  };
}

/*
 * Remove individual file from the form.
 */
export function removeFile(fileList, index) {
  let files = [];
  for(let i = 0; i < fileList.length; i++) {
    if (i !== index) {
      files.push(fileList.get(i));
    }
  }
  return {
    type: constants.REMOVE_FILE,
    payload: {
      files: files
    }
  };
}

/*
 * Handle dropping of files
 */
export function handleFileDrop(currentFiles, newFiles) {
  let errors = [];
  let files = currentFiles.concat(newFiles);
  for (let i = 0; i < files.length; i++) {
    let file = files.get(i);
    file.status = 'pending';

    if (file.type && file.type.indexOf('text/json') !== 0 && file.type.indexOf('application/json') !== 0) {
      file.status = 'failed';
      errors.push(`${file.name}: Wrong file format, please use JSON`);
    }

    if (file.size >= (10 * 1000 * 1000)) {
      file.status = 'failed';
      errors.push(`${file.name}: Maximum supported file size is 10MB`);
    }
  }

  if (errors.length > 0) {
    return {
      type: constants.IMPORT_USERS_VALIDATION_FAILED,
      payload: {
        validationErrors: errors,
        files: files
      }
    };
  }

  return {
    type: constants.DROPPED_FILES,
    payload: {
      files: files
    }
  };
}

/*
 * Clear error message
 */
export function dismissError() {
  return {
    type: constants.DISMISS_ERROR
  };
}
