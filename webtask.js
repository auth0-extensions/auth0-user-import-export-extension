const expressTools = require('auth0-extension-express-tools');
const expressApp = require('./server');

module.exports = expressTools.createServer((config) => {
  console.log('Starting User Import/Export Extension - Version:', config('CLIENT_VERSION'));
  return expressApp(config);
});
