import 'core-js/es6/map';
import 'core-js/es6/set';
import 'raf/polyfill';
import React from 'react';
import { showConsoleWarning } from 'utils';
import { hydrate, render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory, match } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { PersistGate } from 'redux-persist/integration/react';
import createRoutes from 'Scrape/routes';
import configureStore from 'Scrape/store';
import preRenderMiddleware from 'middlewares/preRenderMiddleware';
import { routeLoaded, resetPendingAction, postBrowserError } from 'actions/app';
import EmptySection from 'Scrape/EmptySection';
import EmptyContainer from 'Scrape/EmptyContainer';
import axios from 'axios';

//gloabl stylesheets
require('normalize.css');
require('Scrape/global.css');

if(window.__DEV__) {
  require('axios-response-logger');  
}
//include commonly used functions in prototype
require('utils/extend_functions');

showConsoleWarning();
// Grab the state from a global injected into
// server-generated HTML
const initialState = window.__INITIAL_STATE__;

const store = configureStore(initialState, browserHistory);
const history = syncHistoryWithStore(browserHistory, store);

const routes = createRoutes(store, {url: window.location.href, isClient: true, buildRoutes: window.__BUILD_ROUTES__});
/**
 * Callback function handling frontend route changes.
 */
function onUpdate() {
  store.dispatch(routeLoaded());
}

match({ history, routes }, (error, redirectLocation, renderProps) => {
  if(error) {
    //postBrowserError({error, stack, source, errorInfo, page, url, options, screenshot})
    store.dispatch(postBrowserError({error: error.message, stack: error.stack, url: window.location.url, source:'scrape-react-router-client'}));
    render(<EmptyContainer><EmptySection text="Something went wrong. We are trying to fix it." /></EmptyContainer>, document.getElementById('scrape-container'));
  } else if (redirectLocation) {
    window.location.href= (redirectLocation.pathname  + redirectLocation.search) || '/';
  } else if (renderProps) {
    hydrate(
      <Provider store={store}>
        <Router {...renderProps} onUpdate={onUpdate} history={history}>
        </Router>
      </Provider>, document.getElementById('scrape-container'));
  } else {

  }
});
