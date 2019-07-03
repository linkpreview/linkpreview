const chalk = require('chalk');
const TerserPlugin = require('terser-webpack-plugin');
//const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

exports.client = (config = {}) => {
  return {
      minimize: true,
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendors: {
            //test: /[\\/]node_modules[\\/]/,
            test: /[\\/]node_modules[\\/].*js/,
            /*test(module, chunks) {
              //only js node_modules
              console.log(chalk.red(module.type), module.context);
              const isVendor = (module.type === 'javascript/auto' && module.context.includes('node_modules'));
              console.log(chalk.green('isVendor'), isVendor);
              return isVendor;
            },*/
            name: 'vendors',
            enforce: true,
            chunks: 'all',
          },
          /*styles: {
            //test: /.*css/,
            name: 'styles',
            chunks: 'all'
          },*/
        }
      },
      // Keep the runtime chunk separated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985

      // runtimeChunk: {
      //   name: entrypoint => `runtime~${entrypoint.name}`
      // },
      moduleIds: 'named',
      namedModules: true,
      namedChunks: true,
      chunkIds: 'named'
    };
};

exports.server = (config = {}) => {
  return {
    minimize: true,
  };
};
