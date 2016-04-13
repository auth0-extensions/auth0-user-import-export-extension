const path = require('path');
const nconf = require('nconf');
const express = require('express');
const bodyParser = require('body-parser');
const auth0 = require('auth0-oauth2-express');
const request = require('request');

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/meta', (req, res) => {
  res.status(200).send(metadata);
});

app.post('/users-import', (req, res) => {
  const opt = {
    url: `https://${nconf.get('AUTH0_DOMAIN')}/api/v2/jobs/users-imports`,
    headers: {
      Authorization: req.headers['x-authorization']
    }
  };

  const post = request.post(opt, (err, response, body) => {
    if (err) {
      res.status(400);
      return res.json({ error: err && err.message || body });
    }

    return res.status(response.statusCode).send(body);
  });

  const form = post.form();
  form.append('users', req.body.data.users, { filename: 'file.json', contentType: 'text/plain' });
  form.append('connection_id', req.body.data.connection_id);
});

app.use(auth0({
  scopes: 'create:users read:users read:connections',
  clientName: 'User Import / Export Extension'
}));

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
