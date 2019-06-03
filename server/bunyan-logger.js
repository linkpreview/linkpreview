'use strict';


const path = require('path'),
    config = require('./config'),
    mainFile = path.basename(require.main.filename);

//change log date every time app restarts
//clear file using echo "" > log-file-name
//in the format YYYY-MM-DD-mm
const now = new Date();
const logStartDate = `${now.getFullYear()}-${(now.getMonth() + 1)}-${now.getDate()}`;
const loggerName = `logs-${logStartDate}`;
let streams = null;
if (config.isProd && config.appEngine !== 'ROFS') {
  streams = [{path: 'log/' + loggerName + '.log'}];
} /*else if (process.env.NODE_ENV === 'test') {
  streams = [{
    path: 'log/' + loggerName + '.log'
  }, {
    stream: process.stdout
  }];
} */ else {
  // if running in Development mode or if App Engine runs on read only file system
  streams = [{stream: process.stdout}];
}

module.exports = require('bunyan').createLogger({
  name: loggerName,
  streams: streams
});
