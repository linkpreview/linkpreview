'use strict';
import {codeLoading, codeLoaded, codeLoadError} from 'actions/app';
import { routeErrorHandler, routeModuleHandler } from 'routes/index';
import { polyfill } from 'es6-promise';
import NotFound from 'Scrape/NotFound';
polyfill();

//this handler can only be used if a module is to be resolved from 'containers/Footer' folder
const getComponentHandler = ({store, options, modulePath}) => (location, cb) => {
  store.dispatch(codeLoading());
  import(/* webpackChunkName: "Scrape-[request]" */`Scrape/${modulePath}`)
  .then(routeModuleHandler({store, cb, options}))
  .catch(routeErrorHandler({store, cb, options}));
};

export const SCRAPE_BASE_ROUTE = '/';

export default (store, options) => {
    return {
        path: SCRAPE_BASE_ROUTE,
        name: 'scrape-home',
        getComponent: getComponentHandler({store, options, modulePath: 'App'}),
        childRoutes: [],
        getIndexRoute(location, cb) {
          store.dispatch(codeLoading());
          import(/* webpackChunkName: 'Scrape-Index' */'Scrape/Index')
          .then(routeModuleHandler({store, cb, isIndex: true, options}))
          .catch(routeErrorHandler({store, cb, options}));
        }
    };
}
