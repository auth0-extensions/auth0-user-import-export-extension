import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { push } from 'react-router-redux';
import * as constants from '../constants';

export function login(token) {
  return (dispatch) => {
    const decodedToken = jwtDecode(token);

    dispatch({
      type: constants.LOGIN_SUCCESS,
      payload: {
        userProfile: decodedToken
      }
    });
  };
}

export function logout() {
  return (dispatch) => {
    localStorage.removeItem('apiToken');
    sessionStorage.removeItem('apiToken');

    push('/logout');
  };
}
