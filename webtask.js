const nconf = require('nconf');
const tools = require('auth0-extension-tools');

const expressApp = require('./server');

module.exports = tools.createExpressServer((req, config, storage) => {
  console.log('Starting User Import/Export Extension- Version:', config('CLIENT_VERSION'));

  nconf
    .env()
    .argv()
    .overrides({
      AUTH0_DOMAIN: req.webtaskContext.secrets.AUTH0_DOMAIN,
      AUTH0_SCOPES: req.webtaskContext.secrets.AUTH0_SCOPES,
      NODE_ENV: 'production',
      HOSTING_ENV: 'webtask',
      CLIENT_VERSION: config('CLIENT_VERSION')
    });

  return expressApp(config, storage);
});

