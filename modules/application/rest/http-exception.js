'use strict';

function HttpException(statusCode, message, errors) {
  if (!message) message = 'An error occurred';
  this.statusCode = statusCode;
  this.message = message;
  this.errors = errors;
}

HttpException.prototype = Object.create(Error.prototype);
HttpException.prototype.constructor = HttpException;

HttpException.prototype.sendResponse = function(res) {

  let statusCode = this.statusCode ? this.statusCode : 400;

  const body = {statusCode: statusCode, message: this.message};
  if (this.errors) body.errors = this.errors;
  return res.status(statusCode).send(body);
};

module.exports = HttpException;
