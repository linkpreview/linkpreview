import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import rootReducer from 'Scrape/reducers';
import promiseMiddleware from 'middlewares/promiseMiddleware';
import noopMiddleware from 'middlewares/noop';
import { createLogger } from 'redux-logger';
import { typeChecker } from 'utils';
/*
 * @param {Object} initial state to bootstrap our stores with for server-side rendering
 * @param {History Object} a history object. We use `createMemoryHistory` for server-side rendering,
 *                          while using browserHistory for client-side
 *                          rendering.
 */

export default function configureStore(initialState, history) {
  let middleware = [noopMiddleware, thunk, promiseMiddleware ];
  // Installs hooks that always keep react-router and redux
  // store in sync
  const reactRouterReduxMiddleware = routerMiddleware(history);
  if (__DEVCLIENT__) {
    middleware.push(reactRouterReduxMiddleware, createLogger());
  } else {
    middleware.push(reactRouterReduxMiddleware);
  }

  const finalCreateStore = applyMiddleware(...middleware)(createStore);
  /* eslint-disable no-underscore-dangle */
  const store = finalCreateStore(rootReducer, initialState,
    typeof window === 'object' && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f);
  /* eslint-enable */

  if (process.env.NODE_ENV !== 'production') {
    if (module.hot) {
      // Enable Webpack hot module replacement for reducers
      module.hot.accept('Scrape/reducers', () => {
        const nextReducer = require('Scrape/reducers/index');
        store.replaceReducer(nextReducer);
      });
    }
  }

  return store;
}
