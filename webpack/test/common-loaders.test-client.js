
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
      presets: ["env", "react", 'stage-0'],
      plugins: ['transform-decorators-legacy', 'transform-react-jsx-source']
    },
    include: [path.join(__dirname, '..', 'app')],
    exclude: [path.join(__dirname, '/node_modules/')]
  },
  // the url-loader uses DataUrls.
  // the file-loader emits files.
  //{ test: /\.(woff|woff2)$/,  loader: "url-loader?limit=10000&mimetype=application/font-woff" },
  /*{
    test: /\.(woff|woff2)$/,
    use:[{
      loader: "url-loader",
      options: {
        limit: 1000,
        mimetype: 'application/font-woff'
      }
    }]
  },*/
 /* { test: /\.ttf$/,    loader: "file-loader" },
  { test: /\.eot$/,    loader: "file-loader" },
  { test: /\.less$/,    loader: "less-loader" },*/
  /*{
   test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
   loader: 'url-loader',
   query: {
   name: '[hash].[ext]',
   limit: 10000
   }
   },*/
  {
    test: /\.(css|ttf|eot|less|html|jpg|jpeg|gif|woff|woff2|ico)$/,
    use:[{
      loader: "null-loader",
    }]
    /*loader: 'url-loader',
     query: {
     name: '[hash].[ext]',
     limit: 10000
     }*/
  },
  {
    test: /\.(png|jpg|svg)$/,
    use:[{
      loader: "url-loader",
    }]
    /*loader: 'url-loader',
     query: {
     name: '[hash].[ext]',
     limit: 10000
     }*/
  },
  /*{ test: /\.html$/, loader: 'html-loader' },*/
  /*{
    test: /\.css$/,
    use: [{
      loader:'style-loader',
      options:{
      }
    },
      {
        loader:'css-loader',
        options:{
          localIndentName: '[name]__[local]___[hash:base64:5]',
          modules: true,
          sourceMap: true,
          importLoaders: 1
        }
      },{
        loader:'postcss-loader',
        options: {
          config:  {
            path: 'webpack/postcss.config.dev.js'
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
  }*/
];
