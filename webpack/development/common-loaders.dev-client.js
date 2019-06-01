
const path = require('path');

exports.commonLoaders = [
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
      presets: ["@babel/preset-react", '@babel/preset-env'],
      plugins: ["@babel/plugin-syntax-dynamic-import", "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-export-namespace-from", "@babel/plugin-proposal-export-default-from"]
    },
    include: [path.resolve('app')],
    exclude: [path.join(__dirname, '/node_modules/')]
  },
  { test: /\.less$/,   loader: "less-loader" },
  {
     test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf|ico)$/,
     loader: "file-loader",
     query: {
       name: 'images/[name].[hash].[ext]',
     }
  },
  { test: /\.html$/, loader: 'html-loader' },
  {
    test: /\.css$/,
    use: [{
      loader:'style-loader',
      options:{
      }
    },
      {
        loader:'css-loader',
        options:{
          localIndentName: '[path][name]__[local]--[hash:base64:5]',
          modules: true,
          sourceMap: true,
          importLoaders: 1
        }
      },{
        loader:'postcss-loader',
        options: {
          config:  {
            path: 'webpack/development/postcss.config.js'
          }
        }
      }],
    exclude:[/node_modules/,/global.css/]
  },
  { test: /\.css$/,
    use:[
      'style-loader',
      'css-loader'
    ],
    //loader: 'style!css',
    include:[/node_modules/,/global.css/]
  }
];
