const path = require('path');
const crypto = require("crypto");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const InlineEnviromentVariablesPlugin = require('inline-environment-variables-webpack-plugin');
const webpack = require('webpack');
const CompressionPlugin = require("compression-webpack-plugin");
const WebpackMd5Hash = require('webpack-md5-hash');
const ManifestPlugin = require('webpack-manifest-plugin');
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const NameAllModulesPlugin = require('name-all-modules-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

const publicPath = '/assets/';

//client plugin commons
exports.client = (config = {}) => {
  return [
    //new WebpackMd5Hash(),
    new ManifestPlugin({
      fileName: 'asset-manifest.json'
    }),
    new webpack.HashedModuleIdsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'hex',
      hashDigestLength: 20
    }),
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 50000
    }),
    new ChunkManifestPlugin({
      filename: "chunk-manifest.json",
      manifestVariable: "webpackManifest"
    }),
    // extract inline css from modules into separate files
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash].css',
    }),
    new webpack.IgnorePlugin(/vertx/),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    /*new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      parallel: true,
      compress: {
        warnings: false, // Suppress uglification warnings
        pure_getters: true,
        unsafe: false,
        unsafe_comps: false,
        screw_ie8: true
      },
      output: {
        comments:'/@license/'
      },
      exclude: [/\.min\.js$/gi] // skip pre-minified libs
    }),*/

    //new BundleAnalyzerPlugin(),
    new webpack.DefinePlugin({
      __DEVCLIENT__: false,
      __DEVSERVER__: false,
      __PRODCLIENT__: true,
      __PRODSERVER__: false
    }),
    //new InlineEnviromentVariablesPlugin({ NODE_ENV: 'production' }),
    new webpack.DefinePlugin({ 'global.GENTLY': false }),
    /*new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.(js|png|jpg|css)$/,
      threshold: 10240,
      minRatio: 0.8
    }),*/
    /*new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.optimize\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: {removeAll: true } },
      canPrint: true
    }),*/
    //new NameAllModulesPlugin(),
    new WebpackBuildNotifierPlugin({
      title: "Client Side - Production"
    }),
    // Silence mini-css-extract-plugin generating lots of warnings for CSS ordering.
   // We use CSS modules that should not care for the order of CSS imports, so we
   // should be safe to ignore these.
   //
   // See: https://github.com/webpack-contrib/mini-css-extract-plugin/issues/250
   new FilterWarningsPlugin({
     exclude: /mini-css-extract-plugin[^]*Conflicting order between:/
   })
  ];
};


//server plugin commons
exports.server = (config) => {
  return [
    // Order the modules and chunks by occurrence.
    // This saves space, because often referenced modules
    // and chunks get smaller ids.

    //new WebpackMd5Hash(),
    new webpack.IgnorePlugin(/vertx/),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new ManifestPlugin({
      fileName: 'server-asset-manifest.json'
    }),
    new webpack.HashedModuleIdsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'hex',
      hashDigestLength: 20
    }),
    /*new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash].css',
    }),*/
    new webpack.DefinePlugin({
      __DEVCLIENT__: false,
      __DEVSERVER__: false,
      __PRODCLIENT__: false,
      __PRODSERVER__: true,
      __STAGING__: false,
    }),
    //new InlineEnviromentVariablesPlugin({NODE_ENV: 'production'}),
    new webpack.DefinePlugin({'global.GENTLY': false}),
    new WebpackBuildNotifierPlugin({
      title: "Server Side - Production"
    }),
    // Silence mini-css-extract-plugin generating lots of warnings for CSS ordering.
   // We use CSS modules that should not care for the order of CSS imports, so we
   // should be safe to ignore these.
   //
   // See: https://github.com/webpack-contrib/mini-css-extract-plugin/issues/250
   new FilterWarningsPlugin({
     exclude: /mini-css-extract-plugin[^]*Conflicting order between:/
   })
  ];
};
