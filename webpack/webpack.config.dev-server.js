const path = require('path');
const webpackMerge = require('webpack-merge');
const assetsPath = path.resolve('public/assets');
const publicPath = '/assets/';

const baseConfig = require('./development/webpack.config.dev-server.base');

const serverDevConfig = baseConfig(
  {
    assetsPath,
    publicPath
  }
);

module.exports = webpackMerge(serverDevConfig, {
  entry: {
    scrape: './Scrape/server',
    //embed: './Scrape/Embed/server'
  }
});
