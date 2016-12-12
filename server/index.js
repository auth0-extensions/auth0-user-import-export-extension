const express = require('express');
const tools = require('auth0-extension-express-tools');

const logger = require('./lib/logger');
const config = require('./lib/config');
const metadata = require('../webtask.json');
const htmlRoute = require('./htmlRoute');
const dashboardAdmins = require('./lib/middlewares/dashboardAdmins');

module.exports = (configProvider) => {
  config.setProvider(configProvider);

  const app = express();
  app.use('/meta', (req, res) => {
    res.status(200).send(metadata);
  });
  app.use(dashboardAdmins(config('AUTH0_DOMAIN'), 'User Import / Export Extension', config('AUTH0_RTA')));
  app.get('*', htmlRoute());

  // Generic error handler.
  app.use(tools.middlewares.errorHandler(logger.error.bind(logger)));
  return app;
};
