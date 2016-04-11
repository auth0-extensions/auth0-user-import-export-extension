const nconf = require('nconf');
const Webtask = require('webtask-tools');

module.exports = Webtask.fromExpress((req, res) => {
  nconf.defaults({
    AUTH0_SCOPES: req.webtaskContext.secrets.AUTH0_SCOPES
  });

  // Start the server.
  const server = require('./server');
  return server(req, res);
});
