'use strict';
const morgan = require('morgan');
const path = require('path');
const config = require(path.resolve('./server/config'));

module.exports =  (app) => {

  if(config.isDev && config.showLogs) {
    app.use(morgan('dev'));
  }

};
