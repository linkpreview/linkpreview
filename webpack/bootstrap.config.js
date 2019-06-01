const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const publicPath = '/assets/';


const config = {
  scripts: {

  },
  styles: {
    mixins: true,
    normalize: true,
    scaffolding: true,
    grid: true,
    forms: true,
    buttons: true,
    'button-groups': true,
    utilities: true,
    alerts: true,
    'responsive-utilities': true,
    modals: true,
    media: true,
    navs: true,
  }
};

if(process.env.NODE_ENV === 'production') {
  /*const loader = ExtractTextPlugin.extract({

    fallback: 'style-loader',
    use: [
      {
        loader:'css-loader',
        options: {
          minimize: true,
          modules: false
        }
      },
      {
        loader:'less-loader'
      }
    ],
    publicPath: publicPath
  });*/

  const loader = [
    //{ loader: "style-loader" },
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        // you can specify a publicPath here
        // by default it use publicPath in webpackOptions.output
        publicPath: config.publicPath || publicPath
      }
    },
    {
      loader:'css-loader',
      options: {
        //minimize: true,
        modules: false
      }
    },
    {
      loader:'less-loader'
    }
  ];

  //const loader = require('extract-text-webpack-plugin').extract({ fallback: 'style-loader', use: 'css-loader?sourceMap!less-loader?sourceMap'})

  const styleLoader = loader.map( function(chunk){

    const path = chunk.loader;
    if (chunk.options) {
      const options = JSON.stringify(chunk.options);
      return `${path}?${options}`
    }

    return path
  }).join('!');


  config.styleLoader = styleLoader;

}

module.exports = config;
