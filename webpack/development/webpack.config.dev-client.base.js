const path = require('path');
const webpack = require('webpack');
const commonLoaders = require('./common-loaders.dev-client').commonLoaders;
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const commonDevClientPlugins = require('./common-plugins.dev.js').client;

module.exports = (webpackConfig) => {
    const { assetsPath, publicPath } = webpackConfig;
    return {
      // eval - Each module is executed with eval and //@ sourceURL.
      devtool: 'inline-source-map',
      mode: 'development',
      target: 'web',
      // The configuration for the client
      name: 'browser',
      context: path.resolve('app'),
      node: {
          __dirname: true
      },
      output: {
        chunkFilename: '[name].[id].chunk.client.js',
        // The output directory as absolute path
        path: assetsPath,
        // The filename of the entry chunk as relative path inside the output.path directory
        filename: '[name].client.js',
        // The output path from the view of the Javascript
        publicPath: publicPath
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
          ...commonDevClientPlugins({}),
          new WebpackBuildNotifierPlugin({
            title: "App Client Side - Dev"
          })
      ]
    };
};
