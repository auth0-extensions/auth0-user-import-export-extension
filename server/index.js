const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const tools = require('auth0-extension-express-tools');
const storageTools = require('auth0-extension-tools');

const logger = require('./lib/logger');
const config = require('./lib/config');
const metadata = require('../webtask.json');
const htmlRoute = require('./htmlRoute');
const api = require('./api');

module.exports = (configProvider, storageProvider) => {
  config.setProvider(configProvider);

  const storage = storageProvider
    ? new storageTools.WebtaskStorageContext(storageProvider, { force: 1 })
    : new storageTools.FileStorageContext(path.join(__dirname, './data.json'), { mergeWrites: true });

  const app = express();
  app.use('/app', express.static(path.join(__dirname, '../build')));
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
    baseUrl: config('PUBLIC_WT_URL') || config('WT_URL'),
    clientName: 'User Import / Export Extension',
    urlPrefix: '',
    sessionStorageKey: 'user-import-export-extension:apiToken',
    scopes: 'create:users read:users read:connections create:passwords_checking_job'
  }));

  app.use('/api', api(storage));
  app.get('*', htmlRoute());

  // Generic error handler.
  app.use(tools.middlewares.errorHandler(logger.error.bind(logger)));
  return app;
};
