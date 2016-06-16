const path = require('path');
const nconf = require('nconf');
const express = require('express');
const bodyParser = require('body-parser');
const auth0 = require('auth0-oauth2-express');
const request = require('request');

const metadata = require('./webtask.json');
const htmlRoute = require('./htmlRoute');

module.exports = () => {
  if ((process.env.NODE_ENV || 'development') === 'development') {
    nconf
      .argv()
      .env()
      .file(path.join(__dirname, './config.json'))
      .defaults({
        NODE_ENV: 'development'
      });
  }

  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use('/meta', (req, res) => {
    res.status(200).send(metadata);
  });

  app.post('/users-import', (req, res) => {
    var sent = false;
    const opt = {
      url: `https://${nconf.get('AUTH0_DOMAIN')}/api/v2/jobs/users-imports`,
      headers: {
        Authorization: req.headers['x-authorization']
      }
    };

    const post = request.post(opt, (err, response, body) => {
      if (sent) {
        return null;
      }
      sent = true;

      if (err) {
        res.status(400);
        return res.json({ error: err && err.message || body });
      }

      res.status(response.statusCode);
      return res.json(body);
    });

    try {
      const form = post.form();
      form.append('users', JSON.stringify(JSON.parse(req.body.users), null, 2), { filename: 'file.json', contentType: 'text/plain' });
      form.append('connection_id', req.body.connection_id);
    } catch (e) {
      if (sent) {
        return;
      }
      sent = true;
      res.status(400);
      res.json({ error: e.message });
    }
  });

  app.use(auth0({
    scopes: 'create:users read:users read:connections',
    clientName: 'User Import / Export Extension',
    audience: (req) => `https://${req.webtaskContext.data.AUTH0_DOMAIN}/api/v2/`
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
  }

  return app;
};
