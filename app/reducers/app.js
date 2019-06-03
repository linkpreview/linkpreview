import * as types from 'types/index';
import deepFreeze from 'deep-freeze';
import { LOCATION_CHANGE } from 'react-router-redux';
import NProgress from 'nprogress';
import initialState from 'store/initial-state';
import { errorHandler } from 'reducers/helpers/error';
import { typeChecker } from 'utils';

export const NET_ERR_MSG = 'Network Error';

export default function app(state=initialState.app, action={}) {

  deepFreeze(state);
  switch (action.type) {

    case types.NOT_FOUND:
      return {...state, error:action.error};

    case types.CODE_LOADING:
      return {...state, isCodeLoading: true, netError: ''};

    case types.CODE_LOADED:
      return {...state, isCodeLoading: false, netError: ''};

    case types.CLOSE_NET_ERROR_MESSAGE:
      return {...state, showNetErrorComponent: false};

    //show network error if code is not loaded
    case types.CODE_LOAD_ERROR:
      if(!action.error) {
        action.error = {};
      }
      return {...state, routeLoading: false, isCodeLoading: false, netError: NET_ERR_MSG, error: errorHandler(action.error)};

    case LOCATION_CHANGE:
        return {...state, routeLoading: true, error: '', message: '', showNetErrorComponent: true};

    case types.ROUTE_LOADED:
      return {...state, routeLoading: false};

    case types.APP_LOADED:
      return {...state, appLoaded: true};

    case types.APP_ERROR:
      return {...state, error: action.error};

    case types.APP_MESSAGE:
      return {...state, message: action.message};

    default:
      return state;
  }
}
