const ejs = require('ejs');
const url = require('url');
const nconf = require('nconf');

module.exports = () => {
  const template = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>User Import/Export Dashboard</title>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="shortcut icon" href="https://cdn.auth0.com/styleguide/2.0.1/lib/logos/img/favicon.png">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styles/zocial.min.css">
      <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/manage/v0.3.973/css/index.min.css">
      <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styleguide/3.8.4/index.css">
    </head>
    <body>
      <div id="app"></div>
      <script type="text/javascript">window.config = <%- JSON.stringify(config) %>;</script>
      <script type="text/javascript" src="//cdn.auth0.com/js/lock-9.0.min.js"></script>
      <script type="text/javascript" src="//cdn.auth0.com/manage/v0.3.973/components/ZeroClipboard/ZeroClipboard.js"></script>
      <script type="text/javascript" src="//cdn.auth0.com/manage/v0.3.973/js/bundle.js"></script>
      <script type="text/javascript" src="/app/bundle.js"></script>
    </body>
    </html>
  `;

  return (req, res, next) => {
    const config = {
      AUTH0_DOMAIN: nconf.get('AUTH0_DOMAIN'),
      BASE_URL: url.format({
        protocol: nconf.get('NODE_ENV') !== 'production' ? 'http' : 'https',
        host: req.get('host'),
        pathname: url.parse(req.originalUrl || '').pathname.replace(req.path, '')
      }),
      BASE_PATH: url.parse(req.originalUrl || '').pathname.replace(req.path, '')
    };

    res.send(ejs.render(template, { config }));
  };
};
