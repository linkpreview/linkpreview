const path = require('path');
const webpack = require('webpack');
const assetsPath = path.join(__dirname, '..', 'public', 'assets');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const commonLoaders = require('./common-loaders.test-client').commonLoaders;

module.exports = {
    // eval - Each module is executed with eval and //@ sourceURL.
    //devtool: 'inline-source-map',
    target: 'web',
    // The configuration for the client
    name: 'browser',
    context: path.join(__dirname, '..', 'app'),
    entry: {
      boot: [ './client' ]
    },
    node: {
        __dirname: true
    },
    output: {
      // The output directory as absolute path
      path: assetsPath,
      // The filename of the entry chunk as relative path inside the output.path directory
      filename: '[name].js',
      // The output path from the view of the Javascript
      publicPath: '/assets/'
    },
    module: {
      rules: commonLoaders
    },
    resolve: {
      extensions: ['.js', '.jsx', '.css'],
      modules: [
        'app', 'node_modules'
      ]
    },
    plugins: [
        new webpack.DefinePlugin({
          __DEVCLIENT__: true,
          __DEVSERVER__: false
        }),
        //new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.DefinePlugin({ "global.GENTLY": false }),
        new WebpackBuildNotifierPlugin({
          title: "App Client Side - Dev"
        })
    ]
};
