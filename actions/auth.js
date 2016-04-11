import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { push } from 'react-router-redux';

export function logout() {
  return (dispatch) => {
    localStorage.removeItem('apiToken');
    sessionStorage.removeItem('apiToken');

    push('/logout');
  };
}
