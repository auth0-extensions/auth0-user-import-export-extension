const _ = require('lodash');
const path = require('path');
const Webpack = require('webpack');
const project = require('../../package.json');

module.exports = {
  entry: path.join(__dirname, '../../webtask'),
  target: 'node',
  output: {
    path: './build',
    filename: 'bundle.js',
    library: true,
    libraryTarget: 'commonjs2'
  },
  externals: {
    'async': 'commonjs async',
    'aws-sdk': 'commonjs aws-sdk',
    'aws-sign2': 'commonjs aws-sign2',
    'bluebird': 'commonjs bluebird',
    'compression': 'commonjs compression',
    'delegates': 'commonjs delegates',
    'depd': 'commonjs depd',
    'destroy': 'commonjs destroy',
    'ejs': 'commonjs ejs',
    'express': 'commonjs express',
    'express-jwt': 'commonjs express-jwt',
    'iconv-lite': 'commonjs iconv-lite',
    'lodash': 'commonjs lodash',
    'lru-cache': 'commonjs lru-cache',
    'mime-db': 'commonjs mime-db',
    'moment': 'commonjs moment',
    'mongo-getdb': 'commonjs mongo-getdb',
    'morgan': 'commonjs morgan',
    'ms': 'commonjs ms',
    'qs': 'commonjs qs',
    'raw-body': 'commonjs raw-body',
    'read-all-stream': 'commonjs read-all-stream',
    'request': 'commonjs request',
    'superagent': 'commonjs superagent',
    'type-check': 'commonjs type-check',
    'winston': 'commonjs winston',
    'xml2js': 'commonjs xml2js',
    'auth0': 'commonjs auth0',
    'nconf': 'commonjs nconf',
    'node-uuid': 'commonjs node-uuid',
    'jade': 'commonjs jade',
    'jsonwebtoken': 'commonjs jsonwebtoken',
    'debug': 'commonjs debug',
    'body-parser': 'commonjs body-parser',
    'mime-types': 'commonjs mime-types',
    'webtask-tools': 'commonjs webtask-tools'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: path.join(__dirname, '../../node_modules/')
      },
      { test: /\.json$/, loader: 'json' }
    ]
  },
  plugins: [
    new Webpack.optimize.DedupePlugin(),
    new Webpack.optimize.UglifyJsPlugin({
      minimize: true,
      output: {
        comments: false
      },
      compress: {
        warnings: false
      }
    }),
    new Webpack.DefinePlugin({
      CLIENT_VERSION: JSON.stringify(project.version),
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        CLIENT_VERSION: JSON.stringify(project.version)
      }
    })
  ],
  resolve: {
    modulesDirectories: [ 'node_modules', path.join(__dirname, '../../node_modules/') ],
    root: __dirname,
    alias: {}
  },
  node: false
};
