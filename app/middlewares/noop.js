import { polyfill } from 'es6-promise';
import { codeLoadError } from 'actions/app';
import { typeChecker } from 'utils';
polyfill();

/**
 * Noop Midlleware
 * Redux Middleware
 * @returns {Function}
 * Only returns when action type is present.
 */

export default function noop(store) {
  return next => (action) => {
    if(typeChecker.get(action) === typeChecker.function || (action && action.type)) {
      return next(action);
    }
   };
}
