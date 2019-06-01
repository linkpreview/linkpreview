const path = require('path');
const webpack = require('webpack');
const commonLoaders = require('./common-loaders.dev-server').commonLoaders;
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const nodeExternals = require('webpack-node-externals');
const commonDevServerPlugins = require('./common-plugins.dev').server;

module.exports = (webpackConfig) => {
    const { assetsPath, publicPath } = webpackConfig;

    return {
      // The configuration for the server-side rendering
      name: "server-side rendering",
      devtool: 'inline-source-map',
      mode: 'development',
      context: path.resolve('app'),
      node: {
          __dirname: true,
          __filename: true
      },
      target: "node",
      output: {
        // The output directory as absolute path
        path: assetsPath,
        // The filename of the entry chunk as relative path inside the output.path directory
        filename: "[name].server.js",
        chunkFilename: '[name].chunk.server.js',
        // The output path from the view of the Javascript
        publicPath: publicPath,
        libraryTarget: "commonjs2"
      },
      module: {
        rules: commonLoaders
      },
      resolve: {
        extensions: ['.js', '.jsx', '.css'],
        modules: [
          "app", "node_modules", "modules"
        ]
      },
      plugins: [
          ...commonDevServerPlugins({}),
          new WebpackBuildNotifierPlugin({
            title: "App Server Side - Development"
          }),
      ],
      externals: [
        nodeExternals()
      ],
    };
};
