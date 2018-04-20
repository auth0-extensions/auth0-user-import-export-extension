const _ = require('lodash');
const express = require('express');
const formidable = require('formidable');
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
    baseUrl: config('PUBLIC_WT_URL') || config('WT_URL'),
    onLoginSuccess: (req, res, next) => {
      next();
    }
  }));

  // create import job
  api.post('/jobs/import', (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, function(err, fields, files) {
      if (err) {
        return next(err);
      }

      jobs.usersImport(fields.connection_id, files.users, storage, req.user.access_token)
        .then(job => res.json(job))
        .catch(next);
    });
  });

  // create export job
  api.post('/jobs/export', (req, res, next) => {
    jobs.usersExport(req.body, storage, req.user.access_token)
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
