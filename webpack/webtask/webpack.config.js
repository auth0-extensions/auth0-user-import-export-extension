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
    jade: 'commonjs jade',
    jsonwebtoken: 'commonjs jsonwebtoken',
    'body-parser': 'commonjs body-parser',
    'express-jwt': 'commonjs express-jwt',
    superagent: 'commonjs superagent',
    nconf: 'commonjs nconf',
    express: 'commonjs express',
    'webtask-tools': 'commonjs webtask-tools',
    ejs: 'commonjs ejs'
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
