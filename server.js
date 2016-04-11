const path = require('path');
const nconf = require('nconf');
const express = require('express');
const auth0 = require('auth0-oauth2-express');

const metadata = require('./webtask.json');
const htmlRoute = require('./htmlRoute');

nconf
  .argv()
  .env()
  .file(path.join(__dirname, './config.json'))
  .defaults({
    NODE_ENV: 'development'
  });

const app = express();
app.use(auth0({
  scopes: nconf.get('AUTH0_SCOPES'),
  clientName: 'User Import/Export Extension'
}));

app.use('/meta', (req, res) => {
  res.status(200).send(metadata);
});
app.get('*', htmlRoute());

const port = process.env.PORT || 3000;

if ((process.env.NODE_ENV || 'development') === 'development') {
  app.listen(port, (error) => {
    if (error) {
      console.error(error);
    } else {
      console.log(`Listening on http://localhost:${port}.`);
    }
  });
} else {
  module.exports = Webtask.fromExpress(app);
}
