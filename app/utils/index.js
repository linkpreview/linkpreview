import numeral from 'numeral';
import polyfills from  './polyfills';
import throttle from 'lodash/throttle';
import debouncePromise from 'debounce-promise';

/**
 * Check Type of a variable in reliable way
 * Src: https://stackoverflow.com/questions/7893776/the-most-accurate-way-to-check-js-objects-type
 * @type {{get: types.'get', null: string, object: string, array: string, string: string, boolean: string, number: string, date: string}}
 */
export const typeChecker = {
    'get': (prop) => {
        return Object.prototype.toString.call(prop);
    },
    'null': '[object Null]',
    'object': '[object Object]',
    'array': '[object Array]',
    'string': '[object String]',
    'boolean': '[object Boolean]',
    'number': '[object Number]',
    'date': '[object Date]',
    'function': '[object Function]',
    'undefined': '[object Undefined]'
};

export function showConsoleWarning() {
    console.log("%cWarning!!!.", "background: red; color: yellow; font-size: small; text-align: center;");
}

export function generateDummyData(n){
    return Array(n).fill({loading: true, dummy: true});
}

/**
 * Checks if a resource is in loading or loaded state.
 * For eg. if an itinerary is in loading state => {dummy: true, loading: true}
 * @param data Object
 * @returns {boolean|*}
 */
export function checkLoading(data) {

    //if undefined return isLoading
    if(!data) {
        return true;
    }

    return data.dummy || data.loading;
}

export function throwError(msg) {
    throw new Error(msg);
}

export function throwTypeError(msg) {
    throw new TypeError(msg);
}

/**
 * Parse URL
 * RFC: http://www.ietf.org/rfc/rfc3986.txt
 * Taken from stackoverflow: https://stackoverflow.com/questions/6168260/how-to-parse-a-url
 * @param url
 * @returns {{scheme: *, authority: *, path: *, query: *, fragment: *}}
 */
export function parseUrl(url) {
    const pattern = new RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?");
    const matches =  url.match(pattern);
    return {
        scheme: matches[2],
        authority: matches[4],
        path: matches[5],
        query: matches[7],
        fragment: matches[9]
    };
}

export function checkListLoading(list) {
    if(!Array.isArray(list)) {
        throw new Error('list should be of array type');
    }

    if(list && list.length && list[0].loading === true) {
        return true;
    }

    return false;
}

/**
 * Convert object to query string
 * @param obj
 * @returns {string}
 */
export function serializeParams( obj, config = {} ) {
    const question = '?';
    const keys = Object.keys(obj).reduce((a,k) => {
          if(!obj[k]) return a;
          a.push(k+'='+encodeURIComponent(obj[k]));
          return a;
      },[]).join('&');

      if(config.noQuestion) {
        return keys;
      }

      return question + keys;
}

/**
 * Get full url of current resource
 * @param window
 * @returns {*}
 */
export function getCurrentFullUrl(window) {
    if(window) {
        return window.location.href;
    }
    return '';
}

export const WAIT_MILLI_SECONDS = 300;

/**
 * Debounce function call
 * Delay a promise call by certain milliseconds
 * Used in user input onChange handler. only call the ajax request when user has finished typing.
 * @param func
 * @param wait
 * @returns {Function}
 */
export function debounceSearch(func, wait) {
    return debouncePromise(func, wait || WAIT_MILLI_SECONDS);
}

/**
 * Throttle function call
 * call once in a while when an event is triggering
 * @param func
 * @param wait
 * @param options
 */
export function throttleFunction(func, wait, options) {
    return throttle(func, wait || 80, options);
}


export function noop() {
  return;
};

export function getEmbedUtmFields() {
  return 'utm_medium=site&utm_campaign=embed';
}

export function sanitizeUtmFields(query) {
  const newQuery = {...query};
  //remove utm related fields and referrer

  delete newQuery.utm_source;
  delete newQuery.utm_medium;
  delete newQuery.utm_campaign;
  delete newQuery.utm_content;
  delete newQuery.utm_term;
  delete newQuery.referrer;
  delete newQuery.fbclid;
  return serializeParams(newQuery);
}
