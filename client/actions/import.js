import axios from 'axios';
import csvtojson from 'csvtojson';
import Promise from 'bluebird';
import * as constants from '../constants';

function extractData(fileData) {
  return new Promise((resolve) => {
    const users = [];
    csvtojson()
      .fromString(fileData)
      .on('error',() => resolve(fileData))
      .on('json', user => users.push(user))
      .on('done', () => resolve(JSON.stringify(users)));
  });
}

/*
 * Import a file of users to a specific connection.
 */
export function importUsers(files, connectionId) {
  let jobIndex = -1;

  const formData = new FormData();
  formData.connection_id = connectionId;

  for (let i = 0; i < files.size; i += 1) {
    if (files.get(i).status === 'queued') {
      formData.userFile = files.get(i);
      jobIndex = i;
      break;
    }
  }

  if (!formData.connection_id) {
    return {
      type: constants.FORM_VALIDATION_FAILED,
      payload: {
        error: 'Please choose a connection.'
      }
    };
  }

  if (!formData.userFile) {
    if (files.size) {
      return { type: 'NOOP' };
    }

    return {
      type: constants.FORM_VALIDATION_FAILED,
      payload: {
        error: 'Please add at least one file.'
      }
    };
  }

  return (dispatch, getState) => {
    const state = getState();
    const connection = state.connection.toJS().records.find(item => item.id === connectionId);

    if (formData.userFile) {
      const fileReader = new FileReader();
      fileReader.addEventListener('load', (event) => {
        extractData(event.currentTarget.result)
          .then((users) => {
            formData.users = users;

            const data = new FormData();
            data.append('connection_id', connectionId);
            data.append('users', new Blob([ users ], { type: 'application/json' }));

            dispatch({
              type: constants.SET_CURRENT_JOB,
              payload: {
                connectionId,
                currentJob: formData.users,
                currentJobIndex: jobIndex
              }
            });

            dispatch({
              type: constants.IMPORT_USERS,
              payload: {
                promise: axios.post(`https://${window.config.AUTH0_DOMAIN}/api/v2/jobs/users-imports`, data, {
                  responseType: 'json'
                })
              },
              meta: {
                connection
              }
            });
          });
      });

      fileReader.readAsText(formData.userFile);
    }
  };
}

/*
 * Get the status of a job.
 */
export function probeImportStatus() {
  return (dispatch, getState) => {
    const reducer = getState().import;
    const currentJob = reducer.toJS().currentJob;
    if (currentJob && currentJob.id) {
      dispatch({
        type: constants.PROBE_IMPORT_STATUS,
        payload: {
          promise: axios.get(`https://${window.config.AUTH0_DOMAIN}/api/v2/jobs/${currentJob.id}`, {
            responseType: 'json'
          })
        },
        meta: {
          currentJobId: currentJob.id,
          onSuccess: (res) => {
            if (res && res.data && res.data.status && res.data.status !== 'pending') {
              dispatch(importUsers(reducer.get('files'), reducer.get('connectionId')));
            }
          }
        }
      });
    }
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
  const files = [];
  for (let i = 0; i < fileList.length; i++) {
    if (i !== index) {
      files.push(fileList[i]);
    }
  }
  return {
    type: constants.REMOVE_FILE,
    payload: {
      files
    }
  };
}

/*
 * Handle dropping of files
 */
export function handleFileDrop(currentFiles, newFiles) {
  const errors = [];
  const files = currentFiles.concat(newFiles);
  for (let i = 0; i < newFiles.length; i++) {
    const file = newFiles[i];
    file.status = 'queued';
    if (file.type
      && file.type.indexOf('text/json') !== 0
      && file.type.indexOf('application/json') !== 0
      && file.type.indexOf('text/csv') !== 0
      && file.type.indexOf('application/csv') !== 0
      && file.name.substr(-3).toLocaleLowerCase() !== 'csv'
      && file.name.substr(-4).toLocaleLowerCase() !== 'json'
    ) {
      file.status = 'validation_failed';
      errors.push(`${file.name}: This must be a valid JSON or CSV file.`);
    }

    if (file.size >= (10 * 1000 * 1000)) {
      file.status = 'validation_failed';
      errors.push(`${file.name}: Maximum supported file size is 10 MB`);
    }
  }

  if (errors.length > 0) {
    return {
      type: constants.IMPORT_USERS_VALIDATION_FAILED,
      payload: {
        validationErrors: errors,
        files
      }
    };
  }

  return {
    type: constants.DROPPED_FILES,
    payload: {
      files
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
