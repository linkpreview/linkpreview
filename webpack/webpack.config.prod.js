const path = require('path');
const config = require(path.resolve('./server/config'));

const { getPublicPath } = require(path.resolve('./webpack-v4/helpers'));
let publicPath = getPublicPath('/assets/');
const assetsPath = path.resolve('public/assets');
const webpackMerge = require('webpack-merge');

const serverPublicPath = '/server-assets/';
const serverAssetsPath = path.resolve('public/server-assets');

const baseConfig = require('./production/webpack.base.config.prod');

const client = baseConfig.client(
  {
    publicPath,
    assetsPath
  }
);

const server = baseConfig.server(
  {
    serverPublicPath,
    serverAssetsPath
  }
);

const clientConfig = webpackMerge(client, {
  entry: {
    boot: [ "bootstrap-webpack!../webpack/bootstrap.config.js", './Scrape/client' ],
    //embed: [ './Scrape/Embed/client' ]
  }
});

const serverConfig = webpackMerge(server, {
  entry: {
    scrape: [ "bootstrap-webpack!../webpack/bootstrap.config.js", './Scrape/server' ],
    //embed: ['./Scrape/Embed/server' ]
  }
});

module.exports = [clientConfig, serverConfig];
