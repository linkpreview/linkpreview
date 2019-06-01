const path = require('path');
const webpack = require('webpack');


//client plugin commons
exports.client = (config = {}) => {
  return [
    new webpack.IgnorePlugin(/vertx/),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      __DEVCLIENT__: true,
      __DEVSERVER__: false,
      __PRODCLIENT__: false,
      __PRODSERVER__: false
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DefinePlugin({ "global.GENTLY": false }),
  ];
};


//server plugin commons
exports.server = (config) => {
  return [
    new webpack.IgnorePlugin(/vertx/),
    new webpack.DefinePlugin({ "global.GENTLY": false }),
    new webpack.DefinePlugin({
      __DEVCLIENT__: false,
      __DEVSERVER__: true,
      __STAGING__: false,
      __PRODCLIENT__: false,
      __PRODSERVER__: false
    }),
  ];
};
