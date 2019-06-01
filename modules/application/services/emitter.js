const EventEmitter = require('events');

class AppEmitter extends EventEmitter {}

module.exports = new AppEmitter();

