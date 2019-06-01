
module.exports = {
  /*plugins: {
    'postcss-import':{
      //path: path.resolve('app', './css')
      path: path.join(__dirname, '..', 'app', 'css'),
      // addDependencyTo is used for hot-reloading in webpack
      addDependencyTo: webpack
    },
    'postcss-simple-vars': {},
    // Unwrap nested rules like how Sass does it
    'postcss-nested': {},
    //  parse CSS and add vendor prefixes to CSS rules
    'autoprefixer':{
      browsers: ['last 2 versions', 'IE > 8']
    },
    // A PostCSS plugin to console.log() the messages registered by other
    // PostCSS plugins
    'postcss-reporter':{
      clearMessages: true
    }
  }*/
  plugins: [
    require('postcss-import'),
    require('autoprefixer'),
    //require('postcss-flexbugs-fixes'),
    require('postcss-mixins'),
    require('postcss-simple-vars'),
    require('postcss-nested'),
    require('postcss-reporter')
  ]
};
