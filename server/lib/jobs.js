const Promise = require('bluebird');
const request = require('superagent');

const history = require('./history');
const config = require('./config');

module.exports = {
  usersImport: (connection, file, storage, token) => {
    const url = `https://${config('AUTH0_DOMAIN')}/api/v2/jobs/users-imports`;

    return new Promise((resolve, reject) => {
      request
        .post(url)
        .set('accept', 'json')
        .set('Authorization', `Bearer ${token}`)
        .field('connection_id', connection)
        .attach('users', file.path)
        .end((err, res) => {
          if (err || !res) {
            return reject(err || 'Unknown error');
          }

          if (res.status >= 300) {
            return reject(res.error || res.body || res);
          }

          const job = {
            id: res.body.id,
            type: 'import'
          };

          return history(job, storage)
            .then(() => resolve(res.body));
        })
    });
  },
  usersExport: (data, storage, token) => {
    const url = `https://${config('AUTH0_DOMAIN')}/api/v2/jobs/users-exports`;

    return new Promise((resolve, reject) => {
      request
        .post(url)
        .send(data)
        .set('accept', 'json')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err || !res) {
            return reject(err || 'Unknown error');
          }

          if (res.status >= 300) {
            return reject(res.error || res.body || res);
          }

          const job = {
            id: res.body.id,
            type: 'export'
          };

          return history(job, storage)
            .then(() => resolve(res.body));
        })
    });
  },
  check: (id, storage, token) => {
    const url = `https://${config('AUTH0_DOMAIN')}/api/v2/jobs/${id}`;

    return new Promise((resolve, reject) => {
      request
        .get(url)
        .set('accept', 'json')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err || !res) {
            return reject(err || 'Unknown error');
          }

          if (res.status >= 300) {
            return reject(res.error || res.body || res);
          }

          const job = {
            id: id,
            status: res.body.status,
            summary: res.body.summary
          };

          return history(job, storage)
            .then(() => resolve(res.body));
        })
    });
  },
  report: (id, token) => {
    const url = `https://${config('AUTH0_DOMAIN')}/api/v2/jobs/${id}/errors`;
    return new Promise((resolve, reject) => {
      request
        .get(url)
        .set('accept', 'json')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err || !res) {
            return reject(err || 'Unknown error');
          }

          if (res.status >= 300) {
            return reject(res.error || res.body || res);
          }

          if (res.status === 204) {
            return resolve([ 'Failed to parse users file when importing users.' ]);
          }

          return resolve(res.body);
        })
    });
  }
};
