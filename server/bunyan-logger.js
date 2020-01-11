'use strict';

const path = require('path');
const config = require('./config');
const mainFile = path.basename(require.main.filename);

const now = new Date();
const logStartDate = `${now.getFullYear()}-${(now.getMonth() + 1)}-${now.getDate()}`;
const loggerName = `logs-${logStartDate}`;
let streams = [{ stream: process.stdout }];

module.exports = require('bunyan').createLogger({
  name: loggerName,
  streams: streams,
});
