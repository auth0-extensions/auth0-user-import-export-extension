const path = require('path');
const nconf = require('nconf');
const express = require('express');
const bodyParser = require('body-parser');
const auth0 = require('auth0-oauth2-express');
const axios = require('axios');
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
axios.defaults.headers.common.Authorization = `Bearer ${idToken}`;

const app = express();
app.use(auth0({
  scopes: 'create:users read:users read:connections',
  clientName: 'User Import / Export Extension'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/meta', (req, res) => {
  res.status(200).send(metadata);
});

app.post('/users-import', (req, res) => {
  var file = new Readable();
  file.push(req.body.users);
  file.push(null);
  var formData = {
    connection_id: req.body.connection_id,
    users: file
  };
  axios.post(`https://${nconf.get('AUTH0_DOMAIN')}/api/v2/jobs/users-imports`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 50000,
    responseType: 'json'
  }).then(function (response) {
    res.status(response.status).send(response.data);
  }).catch(function (response) {
    console.log(response);
    res.status(response.status).send(response.data && response.data.message || response.statusText);
  });
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
  module.exports = app;
}
