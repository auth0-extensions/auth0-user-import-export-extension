const request = require('superagent');
const Promise = require('bluebird');
const tools = require('auth0-extension-tools');

const config = require('./config');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  const page = req.query.page;
  const sort = req.query.sort;
  const search = req.query.q;
  let url = `https://${config('AUTH0_DOMAIN')}/api/v2/users?per_page=100&page=${page}&search_engine=v2`;

  if (sort) {
    url += `&sort=${sort}`;
  }
  if (search) {
    url += `&q=${search}`;
  }

  request
    .get(url)
    .set('Authorization', token)
    .set('Content-Type', 'application/json')
    .end((err, response) => {
      if (response && response.body && response.body.error) {
        return next(
          new tools.ManagementApiError(
            response.body.error,
            response.body.error_description || response.body.error,
            err.status
          )
        );
      }

      if (err) {
        return next(err);
      }

      return res.json({
        users: response.body,
        limits: {
          remaining: response.headers['x-ratelimit-remaining'],
          reset: response.headers['x-ratelimit-reset']
        }
      });
    });
};
