'use strict';

function PromiseValidationError(statusCode, message, errors) {
  if (!message) message = 'Validation Error';
  this.name = 'PromiseValidationError';
  this.statusCode = statusCode;
  this.message = message;
  this.errors = errors;
}

PromiseValidationError.prototype = Object.create(Error.prototype);
PromiseValidationError.prototype.constructor = PromiseValidationError;

PromiseValidationError.prototype.sendResponse = function(res) {

  let statusCode = this.statusCode ? this.statusCode : 400;

  const body = {statusCode: statusCode, message: this.message};
  if (this.errors) body.errors = this.errors;
  return res.status(statusCode).send(body);
};

module.exports = PromiseValidationError;
