const Promise = require('promise');
/**
 * Breaks the promise chain by throwing and undefined in error.
 * Check for undefined error in catch method
 * @returns {Promise<R>|Promise}
 */

exports.promiseBreaker = () => {
  return Promise.reject(undefined);
};