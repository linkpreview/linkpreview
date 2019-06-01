/*eslint consistent-return: 0, no-else-return: 0*/
import { polyfill } from 'es6-promise';
//import axios from 'services/axios';
import axios from 'axios';
import * as types from './types';
import { replace } from 'react-router-redux';
import { SCRAPE_BASE_ROUTE } from 'Scrape/routes';
polyfill();

function makeScrapeRequest(method, data, api='/api/v1/scrape') {
  if(data && method === 'get') {
    return axios[method](api, {params: data});
  }
  return axios[method](api, data);    
}

export function getScrapes({query, options}) {
    return {
        type: types.GET_SCRAPE,
        promise: makeScrapeRequest('get', query)
    };
}

export function clientsMsg(msg) {
    return {
        type: types.SCRAPE_MSG,
        message: msg
    }
}

export function clientsError(error) {
    return {
        type: types.SCRAPE_ERROR,
        error: error
    }
}
