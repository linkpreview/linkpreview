
module.exports = {
  /*plugins: {

    'postcss-import':{},
    // Note: you must set postcss-mixins before simple-vars and nested
    'postcss-mixins':{},
    'postcss-simple-vars':{},
    // Unwrap nested rules like how Sass does it
    'postcss-nested':{},
    //  parse CSS and add vendor prefixes to CSS rules
    'autoprefixer':{
      //browsers: ['cover 99.5%']
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
    require('postcss-mixins'),
    require('postcss-simple-vars'),
    require('postcss-nested'),
    require('postcss-reporter')
  ]
};