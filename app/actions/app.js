import { polyfill } from 'es6-promise';
import axios from 'axios';
import * as types from 'types/index';
import { throwTypeError } from 'utils';
polyfill();

/**
 * Api Request
 */
function makeAppRequest(method, data, api='/api/statistics') {
  if(data && method === 'get') {
    return axios[method](api, {params: data});
  }
  return axios[method](api, data);
}


export function postBrowserError({error, stack, source, errorInfo, page, url, options, screenshot}) {
  if(__DEVSERVER__ || __DEVCLIENT__) {

    console.error(error)
    console.error(stack);
    console.error(source);
    console.error(url);
    console.error(options);
  }
  return makeAppRequest('post', {error, stack, source, errorInfo, page, url, options, screenshot}, `/api/error/browser`);
}


export function codeLoading() {
  return {
    type: types.CODE_LOADING
  };
}

export function noop() {
  return {
    type: types.NOOP
  }
}

export function codeLoaded() {
  return {
    type: types.CODE_LOADED
  };
}

export function codeLoadError(error, options) {

  if(error) {
    postBrowserError({error:error.message, stack: error.stack, source: 'routes', options}).then((response) => {
      console.log('CODE_LOAD_ERROR_POSTED');
    }).catch((err) => {
      console.log('CODE_LOAD_ERROR_POST_ERROR');
    });
  };

  return {
    type: types.CODE_LOAD_ERROR,
    error: error,
    options
  }
}

export function closeNetErrorComponent() {
  return {
    type: types.CLOSE_NET_ERROR_MESSAGE
  }
}

export function appLoaded() {
  return {
    type: types.APP_LOADED
  }
}

export function routeLoaded() {
  return {
    type: types.ROUTE_LOADED
  }
}

export function appError(error) {
  return {
    type: types.APP_ERROR,
    error
  }
}

export function appMessage(message) {
  return {
    type: types.APP_MESSAGE,
    message
  }
}
