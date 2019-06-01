import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import rootReducer from 'reducers';
import noopMiddleware from 'middlewares/noop';
import promiseMiddleware from 'middlewares/promiseMiddleware'
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist'
import localForage from "localforage";
import pendingTasks from 'services/pending-task';
import { resetPendingAction } from 'actions/app';
import { noop, typeChecker } from 'utils';

const persistConfig = {
  key: 'namchey_root',
  storage: localForage,
  whitelist: ['pending']
};

/*
 * @param {Object} initial state to bootstrap our stores with for server-side rendering
 * @param {History Object} a history object. We use `createMemoryHistory` for server-side rendering,
 *                          while using browserHistory for client-side
 *                          rendering.
 */

export default function configureStore(initialState, history, options = {}) {
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

  const persistedReducer = persistReducer(persistConfig, rootReducer);


  /* eslint-disable no-underscore-dangle */
  const store = finalCreateStore(
    !options.isServer ? persistedReducer : rootReducer,
    initialState,
    typeof window === 'object' && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
  );
  /* eslint-enable */

  if (process.env.NODE_ENV !== 'production') {
    if (module.hot) {
      // Enable Webpack hot module replacement for reducers
      module.hot.accept('reducers', () => {
        const nextReducer = require('reducers');
        store.replaceReducer(
          rootReducer, nextReducer
        );
      });
    }
  }

  let persistor = null;
  if(!options.isServer) {
    persistor = persistStore(store, null, () => {
      //complete pending tasks that was dispatched when unauthenticated
      pendingTasks({state: store.getState(), dispatch: store.dispatch}).then(() => {

      });
    });
  }

  /*const persistor = {};*/

  return { store, persistor };
}
