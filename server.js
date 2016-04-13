const path = require('path');
const nconf = require('nconf');
const express = require('express');
const bodyParser = require('body-parser');
const auth0 = require('auth0-oauth2-express');
const request = require('request');
const Readable = require('stream').Readable;

const metadata = require('./webtask.json');
const htmlRoute = require('./htmlRoute');

nconf
  .argv()
  .env()
  .file(path.join(__dirname, './config.json'))
  .defaults({
    NODE_ENV: 'development'
  });

const idToken = '';
const defaultHeaders = { 'Authorization': `Bearer ${idToken}` };

const app = express();
app.use(auth0({
  scopes: 'create:users read:users read:connections',
  clientName: 'User Import / Export Extension'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/meta', (req, res) => {
  res.status(200).send(metadata);
});

app.post('/users-import', (req, res) => {
  var file = new Readable();
  file.push(req.body.data.users);
  file.push(null);
  var postRequest = request.post({
    url: `https://${nconf.get('AUTH0_DOMAIN')}/api/v2/jobs/users-imports`,
    headers: defaultHeaders
  }, function (err, response, body) {
    console.log(err, response, body);
    if (err) {
      console.log(err, response, body);
    }
    res.status(response.statusCode).send(body);
  });
  var form = postRequest.form();
  form.append('users', file);
  form.append('connection_id', req.body.data.connection_id);
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
