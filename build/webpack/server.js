const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const config = require('./config.dev.js');

const options = {
  publicPath: 'http://localhost:3001/app/',
  hot: true,
  inline: true,
  historyApiFallback: true,
  proxy: {
    '*': 'http://localhost:3000'
  },

  quiet: false,
  noInfo: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },

  stats: { colors: true },
  headers: { 'Access-Control-Allow-Origin': '*' }
};

new WebpackDevServer(webpack(config), options)
  .listen(3001, 'localhost',
    (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Webpack server listening on: http://localhost:3001');

        // Start the actual server.
        require('../../index.js');
      }
    });
