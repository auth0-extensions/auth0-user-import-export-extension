const nconf = require('nconf');
const webtask = require('webtask-tools');

var server = null;

module.exports = webtask.fromExpress((req, res) => {
  if (!server) {
    console.log('Creating server.');
    console.log(' > Environment:', process.env);
    console.log(' > Secrets:', {
      AUTH0_DOMAIN: req.webtaskContext.secrets.AUTH0_DOMAIN,
      AUTH0_SCOPES: req.webtaskContext.secrets.AUTH0_SCOPES,
      NODE_ENV: 'production',
      HOSTING_ENV: 'webtask',
      CLIENT_VERSION: CLIENT_VERSION
    });

    // Initialize config.
    nconf
      .env()
      .argv()
      .overrides({
        AUTH0_DOMAIN: req.webtaskContext.secrets.AUTH0_DOMAIN,
        AUTH0_SCOPES: req.webtaskContext.secrets.AUTH0_SCOPES,
        NODE_ENV: 'production',
        HOSTING_ENV: 'webtask',
        CLIENT_VERSION: CLIENT_VERSION
      });

    // Start the server.
    const initServer = require('./server');
    server = initServer();
  }

  return server(req, res);
});
