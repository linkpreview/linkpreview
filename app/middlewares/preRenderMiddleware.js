
import { checkCrawler } from 'services/user-agent';
import { polyfill } from 'es6-promise';
polyfill();

/**
 * This is not a redux middleware
 * @param dispatch
 * @param components
 * @param params
 * @param req
 * @returns {*}
 */
export default function preRenderMiddleware(dispatch, components, params, req) {
  let promises = [];
  try {
    const needs = components.reduce( (prev, current) => {
      if(!current) {
        return [];
      }
      return (current.need || [])
        //.concat((current.WrappedComponent ? current.WrappedComponent.need : []) || [])
        .concat(prev);
    }, []);
    //if the request is by crawlers, log the request

    if(req && req.headers && checkCrawler(req.headers['user-agent'])) {
       promises = needs.map((need) => {
        return dispatch(need({...params, crawler: req.headers['user-agent']}));
      });
    } else if(req) {
      promises = needs.map((need) => {
        return dispatch(need({...params, crawler: req.headers['user-agent']}));
      });
    }

  } catch (err) {
    return Promise.reject(err);
  }

  return Promise.all(promises);
}
