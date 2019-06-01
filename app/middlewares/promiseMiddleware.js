import { polyfill } from 'es6-promise';
import { codeLoadError } from 'actions/app';
polyfill();

/**
 * Promise Midlleware
 * Redux Middleware
 * @returns {Function}
 */

export default function promiseMiddleware(store) {
  return next => (action = {}) => {
    let { promise, type, ...rest } = action;
    if (!promise) return next(action);

    const SUCCESS = type + '_SUCCESS';
    const REQUEST = type + '_REQUEST';
    const FAILURE = type + '_FAILURE';
    next({ ...rest, type: REQUEST });
    return promise
      .then(req => {
        next({ ...rest, req, type: SUCCESS });
        return true;
      })
      .catch(error => {
        if(error.response && error.response.code === 'NET_ERR') {
          store.dispatch(codeLoadError(error));
        }
        next({ ...rest, error, type: FAILURE });
        return false;
      });
   };
}
