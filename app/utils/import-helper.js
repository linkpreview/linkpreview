import { codeLoaded } from 'actions/app';

export function errorLoading(err) {
  console.error('Dynamic page loading failed', err);
}

export function loadRoute(store, cb) {
  store.dispatch(codeLoaded());
  return (module) => cb(null, module.default);
}
