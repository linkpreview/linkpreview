'use strict';
import React  from 'react';
import {codeLoading, codeLoaded, codeLoadError} from 'actions/app';
import { routeErrorHandler, routeModuleHandler } from 'routes/index';

//this handler can only be used if a module is to be resolved from 'containers/Post' folder
const getComponentHandler = ({store, options, modulePath}) => (location, cb) => {
  store.dispatch(codeLoading());
  import(`Scrape/${modulePath}`)
  .then(routeModuleHandler({store, cb, options}))
  .catch(routeErrorHandler({store, cb, options}));
};

export default (store, options) => {
  return {
    childRoutes: [{
      name: 'docs',
      path: 'docs',
      getComponent: getComponentHandler({store, options, modulePath: 'Docs'})    
    }]
  }
}
