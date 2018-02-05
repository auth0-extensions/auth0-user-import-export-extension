const express = require('express');
const middlewares = require('auth0-extension-express-tools').middlewares;

const config = require('./lib/config');
const utils = require('./lib/utils');
const jobs = require('./lib/jobs');

module.exports = (storage) => {
  const api = express.Router();

  api.use(middlewares.authenticateAdmins({
    credentialsRequired: true,
    secret: config('EXTENSION_SECRET'),
    audience: 'urn:user-import-export-extension',
    baseUrl: config('WT_URL'),
    onLoginSuccess: (req, res, next) => {
      next();
    }
  }));

  // create job
  api.post('/jobs/:type', (req, res, next) => {
    if (req.params.type !== 'import' && req.params.type !== 'export') {
      return res.status(404).send();
    }

    jobs.create(req.body, req.params.type, storage, req.user.access_token)
      .then(job => res.json(job))
      .catch(next);
  });

  // check job status
  api.get('/jobs/:id', (req, res, next) => {
    jobs.check(req.params.id, storage, req.user.access_token)
      .then(job => res.json(job))
      .catch(next);
  });

  // check job report
  api.get('/jobs/:id/report', (req, res, next) => {
    jobs.report(req.params.id, req.user.access_token)
      .then(job => res.json(job))
      .catch(next);
  });

  // get connections list
  api.get('/connections', (req, res, next) => {
    utils.getConnections(req.query.strategy || null, req.user.access_token)
      .then(data => res.json(data))
      .catch(next);
  });

  // get users count
  api.get('/users', (req, res, next) => {
    utils.getUsersCount(req.query.connection || null, req.user.access_token)
      .then(data => res.json(data))
      .catch(next);
  });

  // get jobs list
  api.get('/history', (req, res, next) => {
    storage.read()
      .then(data => res.json(data))
      .catch(next);
  });

  return api;
};
