const nconf = require('nconf');
const webtask = require('webtask-tools');

var server = null;

module.exports = webtask.fromExpress((req, res) => {
  if (!server) {
    nconf.defaults({
      AUTH0_DOMAIN: req.webtaskContext.secrets.AUTH0_DOMAIN,
      AUTH0_SCOPES: req.webtaskContext.secrets.AUTH0_SCOPES,
      NODE_ENV: 'production',
      HOSTING_ENV: 'webtask',
      CLIENT_VERSION: process.env.CLIENT_VERSION
    });

    // Start the server.
    const initServer = require('./server');
    server = initServer();
  }

  return server(req, res);
});
