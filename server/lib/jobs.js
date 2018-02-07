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
          if (err) {
            return reject(err);
          }

          if (res.status >= 200 && res.status <= 300) {
            const job = {
              id: res.body.id,
              type: 'import'
            };

            return history(job, storage)
              .then(() => resolve(res.body));
          }

          return reject((res && res.error) || res);
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
          if (err) {
            return reject(err);
          }

          if (res.status >= 200 && res.status <= 300) {
            const job = {
              id: res.body.id,
              type: 'export'
            };

            return history(job, storage)
              .then(() => resolve(res.body));
          }

          return reject((res && res.error) || res);
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
          if (err) {
            return reject(err);
          }

          if (res.status >= 200 && res.status <= 300) {
            const job = {
              id: id,
              status: res.body.status,
              summary: res.body.summary
            };

            return history(job, storage)
              .then(() => resolve(res.body));
          }

          return reject((res && res.error) || res);
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
          if (err) {
            return reject(err);
          }

          if (res.status >= 200 && res.status <= 300) {
            return resolve(res.body);
          }

          return reject((res && res.error) || res);
        })
    });
  }
};
