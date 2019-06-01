if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);
import React  from 'react';
import { codeLoading, codeLoaded, codeLoadError } from 'actions/app';
import EmptySection from 'Scrape/EmptySection';
import EmptyContainer from 'Scrape/EmptyContainer';
import { polyfill } from 'es6-promise';
polyfill();
export const routeErrorHandler = ({store, cb, options}) => (error) => {
  store.dispatch(codeLoadError(error, options));
  cb(error, props => {
      return (<EmptyContainer {...props} children={<EmptySection text="Network Error." />} />);
  });
};

export const routeModuleHandler = ({store, cb, isIndex, isMultiple, options}) => (module) => {
  store.dispatch(codeLoaded());
  if(isIndex) {
      return cb(null, {component: module.default});
  }

  if(isMultiple) {
    return cb(null, module.map((singleModule) => {
      return singleModule.default(store, options);
    }));
  }

  cb(null, module.default);
};
