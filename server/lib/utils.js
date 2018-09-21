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

const getConnections = (strategy, token) => {
  const concurrency = 5;
  const perPage = 100;
  const result = [];
  const url = `https://${config('AUTH0_DOMAIN')}/api/v2/connections`;

  let total = 0;
  let pageCount = 0;
  let query = `?per_page=${perPage}`;
  if (strategy) {
    query += '&strategy=auth0';
  }
  const getTotals = () => {
    const totalsUrl = `${url}${query}&page=0&include_totals=true`;
    return makeRequest(totalsUrl, token)
      .then((response) => {
        total = response.total || 0;
        pageCount = Math.ceil(total / perPage);
        const data = response.connections || response || [];
        data.forEach(item => result.push(item));
        return null;
      });
  };

  const getPage = (page) => {
    const pageUrl = `${url}${query}&page=${page}`;
    return makeRequest(pageUrl, token)
      .then((response) => {
        response.forEach(item => result.push(item));
        return null;
      });
  };

  const getAll = () =>
    getTotals()
      .then(() => {
        if (total === 0 || result.length >= total) {
          return result;
        }

        const pages = [];
        for (let i = 1; i <= pageCount; i++) {
          pages.push(i);
        }

        return Promise.map(pages, getPage, { concurrency });
      });

  return getAll().then(() => result);
};

module.exports = {
  getUsersCount: (connection, token) => {
    let url = `https://${config('AUTH0_DOMAIN')}/api/v2/users?per_page=1&page=0&include_totals=true&search_engine=v3`;
    if (connection) {
      url += `&q=identities.connection:"${connection}"`
    }

    return makeRequest(url, token);
  },
  getConnections
};
