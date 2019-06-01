const path = require('path');
const webpackMerge = require('webpack-merge');
const assetsPath = path.resolve('public/assets');
const publicPath = '/assets/';

const baseConfig = require('./development/webpack.config.dev-client.base');

const clientDevConfig = baseConfig(
  {
    assetsPath,
    publicPath
  }
);

const config = webpackMerge(clientDevConfig, {
  entry: {
    'boot': [ /*"bootstrap-webpack!../webpack/bootstrap.config.js",*/ './Scrape/client' ],
    //embed: [ './Scrape/Embed/client' ]
  }
});

module.exports = config;
