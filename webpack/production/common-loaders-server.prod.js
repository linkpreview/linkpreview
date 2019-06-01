const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');
const publicPath = '/assets/';

exports.commonLoaders = (config = {}) => {
  return [
    {
      /*
       * TC39 categorises proposals for babel in 4 stages
       * Read more http://babeljs.io/docs/usage/experimental/
       */
      test: /\.js$|\.jsx$/,
      loader: 'babel-loader',
      // Reason why we put this here instead of babelrc
      // https://github.com/gaearon/react-transform-hmr/issues/5#issuecomment-142313637
      options: {
        'presets': ["@babel/preset-react", '@babel/preset-env'],
        'plugins': [
          /*'transform-decorators-legacy',
          'transform-react-remove-prop-types',
          'transform-react-constant-elements',
          'transform-react-inline-elements'*/
          "@babel/plugin-syntax-dynamic-import", "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-export-namespace-from", "@babel/plugin-proposal-export-default-from"
        ]
      },
      include: [path.resolve('app')],
      exclude: [path.join(__dirname, '/node_modules/')]
    },
    //{test: /\.json$/, loader: 'json-loader', type: 'javascript/auto'},
    {
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf|ico)$/,
      loader: "file-loader",
      options: {
        name: 'images/[name].[hash].[ext]',
      }
    },
    {
      test: /\.css$/,
      use: [{
        loader:'css-loader/locals',
        options: {
          //localIndentName: '[name]__[local]___[hash:base64:5]',
          sourceMap: true,
          modules: true,
          importLoaders: 1
        }
      }]
    }
  ];
};
