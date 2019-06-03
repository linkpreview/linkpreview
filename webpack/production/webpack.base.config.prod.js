const path = require('path');
const webpack = require('webpack');
const config = require(path.resolve('./server/config'));

const nodeExternals = require('webpack-node-externals');

exports.client = (webpackConfig) => {

  const publicPath = webpackConfig.publicPath;
  const assetsPath = webpackConfig.assetsPath;
  const vendors = webpackConfig.vendors;
  const externals = webpackConfig.externals;

  const commonLoaders = require('./common-loaders.prod').commonLoaders({publicPath});
  const commonClientPlugings = require('./common-plugins.prod').client({publicPath});
  const commonClientOptimizations = require('./common-optimization.prod').client({publicPath});

  const clientConfig = {
      // The configuration for the client
      //devtool: 'source-map',
      name: 'browser',
      mode: 'production',
      context: path.resolve('app'),
      node: {
        __dirname: true
      },
      output: {
        // The output directory as absolute path
        path: assetsPath,
        hashFunction: 'sha256',
        // The filename of the entry chunk as relative path inside the output.path directory
        filename: '[name].[hash].js',
        chunkFilename: '[name].[chunkhash].chunk.js',
        // The output path from the view of the Javascript
        publicPath: publicPath
      },
      module: {
        rules: commonLoaders
      },
      resolve: {
        extensions: ['.js', '.jsx', '.css', '.json'],
        modules: [
          'app', 'node_modules'
        ]
      },
      plugins: commonClientPlugings.concat([
        /*new webpack.ProvidePlugin({
          React: "React", react: "React", "window.react": "React", "window.React": "React"
        })*/
      ]),
      optimization: commonClientOptimizations,
      target: 'web',
      stats: { children: false },
      //postcss: postCSSConfig
      /*externals : {
        react: 'React',
        'react-dom': 'ReactDOM'
      },*/
    };

    return clientConfig;
};

exports.server = (webpackConfig) => {

  /*Server*/
  //const serverEntryName = webpackConfig.serverEntryName;
  //const serverEntryFile = webpackConfig.serverEntryFile;
  const serverPublicPath = webpackConfig.serverPublicPath;
  const serverAssetsPath = webpackConfig.serverAssetsPath;

  const commonLoadersServer = require('./common-loaders-server.prod').commonLoaders({publicPath: serverPublicPath});
  const commonServerPlugings = require('./common-plugins.prod').server({publicPath: serverPublicPath});
  const commonServerOptimizations = require('./common-optimization.prod').server({publicPath: serverPublicPath});


  /**
   * Server side
   */
  const serverConfig =  {
      // The configuration for the server-side rendering
      //devtool: 'hidden-source-map',
      name: 'server-side rendering',
      //devtool: 'inline-source-map',
      mode: 'production',
      context: path.resolve('app'),
      node: {
        __dirname: true
      },
      target: 'node',
      externals: [
        nodeExternals({
          // load non-javascript files with extensions, presumably via loaders
          whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i],
        })
      ],
      output: {
        hashFunction: 'sha256',
        // The output directory as absolute path
        path: serverAssetsPath,
        // The filename of the entry chunk as relative path inside the output.path directory
        filename: '[name].server.js',
        chunkFilename: '[name].[chunkhash].chunk.server.js',
        // The output path from the view of the Javascript
        publicPath: serverPublicPath,
        libraryTarget: 'commonjs2'
      },
      module: {
        rules: commonLoadersServer
      },
      resolve: {
        extensions: ['.js', '.jsx', '.css', '.json'],
        modules: [
          'app', 'node_modules'
        ]
      },
      plugins: commonServerPlugings.concat([
        new webpack.DefinePlugin({
          __STAGING__: false
        })
      ]),
      optimization: commonServerOptimizations,
      stats: { children: false },

    };

    return serverConfig;
};
