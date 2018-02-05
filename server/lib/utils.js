const Promise = require('bluebird');
const request = require('superagent');

const config = require('./config');

const makeRequest = (url, token) => {
  return new Promise((resolve, reject) => {
    request
      .get(url)
      .set('accept', 'json')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) {
          return reject(err);
        }

        if (res.status >= 200 && res.status <= 300) {
          return resolve(res.body)
        }

        return reject((res && res.error) || res);
      })
  });
};

module.exports = {
  getConnections: (strategy, token) => {
    let url = `https://${config('AUTH0_DOMAIN')}/api/v2/connections`;
    if (strategy) {
      url += '?strategy=auth0';
    }

    return makeRequest(url, token);
  },
  getUsersCount: (connection, token) => {
    let url = `https://${config('AUTH0_DOMAIN')}/api/v2/users?per_page=1&page=0&include_totals=true&search_engine=v1`;
    if (connection) {
      url += `&connection=${connection}`
    }

    return makeRequest(url, token);
  }
};
