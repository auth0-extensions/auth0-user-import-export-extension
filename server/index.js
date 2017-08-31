const express = require('express');
const bodyParser = require('body-parser');
const tools = require('auth0-extension-express-tools');

const logger = require('./lib/logger');
const config = require('./lib/config');
const getUsers = require('./lib/getUsers');
const metadata = require('../webtask.json');
const htmlRoute = require('./htmlRoute');

module.exports = (configProvider) => {
  config.setProvider(configProvider);

  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use('/meta', (req, res) => {
    res.status(200).send(metadata);
  });

  app.use(tools.routes.dashboardAdmins({
    secret: config('EXTENSION_SECRET'),
    audience: 'urn:user-import-export-extension',
    rta: config('AUTH0_RTA').replace('https://', ''),
    domain: config('AUTH0_DOMAIN'),
    baseUrl: config('WT_URL'),
    clientName: 'User Import / Export Extension',
    urlPrefix: '',
    sessionStorageKey: 'user-import-export-extension:apiToken',
    scopes: 'create:users read:users read:connections'
  }));

  app.get('/api/users', getUsers);
  app.get('*', htmlRoute());

  // Generic error handler.
  app.use(tools.middlewares.errorHandler(logger.error.bind(logger)));
  return app;
};
