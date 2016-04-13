const nconf = require('nconf');
const webtask = require('webtask-tools');

module.exports = webtask.fromExpress((req, res) => {
  nconf.defaults({
    AUTH0_DOMAIN: req.webtaskContext.secrets.AUTH0_DOMAIN,
    AUTH0_SCOPES: req.webtaskContext.secrets.AUTH0_SCOPES,
    NODE_ENV: 'production',
    HOSTING_ENV: 'webtask',
    CLIENT_VERSION: process.env.CLIENT_VERSION
  });

  // Start the server.
  const server = require('./server');
  return server(req, res);
});
