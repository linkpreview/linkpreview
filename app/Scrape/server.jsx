import React from 'react';
import { renderToString } from 'react-dom/server';
import { RouterContext, match, createMemoryHistory } from 'react-router'
import { Provider } from 'react-redux';
import createRoutes from 'Scrape/routes';
import createEmbedRoutes from 'Scrape/routes/embed';
import configureStore from 'Scrape/store';
import headconfigFactory from 'components/Head/Meta';
import preRenderMiddleware from 'middlewares/preRenderMiddleware';
import { initialState as storeInitialState } from 'Scrape/store';
import renderFullPage from 'views/scrape';
import renderErrorPage from 'views/500';
import render404Page from 'views/404';
import axios from 'axios';
import { commonMeta } from 'head/common';
import { postBrowserError } from 'actions/app';
import querystring from 'querystring';
//include commonly used functions in prototype
require('utils/extend_functions');


export const REAL_IP_HEADER = 'x-real-ip';

export const forwardHeaders = ({req, axios, authenticated, isStaging}) => {
  const requestInterceptor = axios.interceptors.request.use( (config) => {
    if(req.headers['user-agent']) {
      config.headers['user-agent'] = req.headers['user-agent'];
    }
    if(req.headers['referer']) {
      config.headers['referer'] = req.headers['referer'];
    }
    if(req.headers[REAL_IP_HEADER]) {
      config.headers['REAL_IP_HEADER'] = req.headers[REAL_IP_HEADER];
    }

    if(authenticated && req.headers.cookie) {
      config.headers['cookie'] = req.headers.cookie;
    }

    return config;
  },  (error) => {
    return Promise.reject(error);
  });

  const responseInterceptor = axios.interceptors.response.use( (response) => {
    axios.interceptors.request.eject(requestInterceptor);
    axios.interceptors.response.eject(responseInterceptor);
    return response;
  },  (error) => {
    axios.interceptors.request.eject(requestInterceptor);
    axios.interceptors.response.eject(responseInterceptor);
    return Promise.reject(error);
  });
};


export function postRenderError(error, url) {
  postBrowserError({error: error.message, stack: error.stack, source: 'Server Render - Scrape', url}).then((response) => {
    console.log('SERVER_RENDER_ERROR_POSTED');
  }).catch((error) => {
    console.log('SERVER_RENDER_ERROR_POST_ERROR');
  });
}

function renderContent({res, componentHTML, initialState, headconfig, chunkManifest, styles, scripts, metaProperties, status}) {
  const output = renderFullPage(componentHTML, initialState, {
    title: headconfig.title,
    meta: headconfig.meta,
    link: headconfig.link,
    scripts: chunkManifest
  }, styles, scripts, metaProperties);
  return res.status(status ? status : 200).send(output);
}

/*
 * Export render function to be used in server/config/routes.js
 * We grab the state passed in from the server and the req object from Express/Koa
 * and pass it into the Router.run function.
 */
export default function render(req, res, next, assetManifest, chunkManifest) {
  axios.defaults.baseURL = `http://${req.clientConfig.host}:${req.clientConfig.port}`;
  let styles = '';

  let scripts = `
  <script type="text/javascript" charset="utf-8" src="/assets/boot.client.js"></script>
  `;

  const isProd = process.env.NODE_ENV === 'production';
  if(isProd) {
    styles = `
    <link rel="stylesheet" href="${assetManifest['boot.css']}"/>
    <link rel="stylesheet" href="${assetManifest['vendors.css']}"/>
  `;

    scripts = `
    <script defer type="text/javascript" charset="utf-8" src="${assetManifest['runtime.js']}"></script>
    <script defer type="text/javascript" charset="utf-8" src="${assetManifest['vendors.js']}"></script>
    <script defer type="text/javascript" charset="utf-8" src="${assetManifest['boot.js']}"></script>
  `
  }

  const history = createMemoryHistory();
  const authenticated = false;
  //const authenticated = req.isAuthenticated();

  const user = null;

  /*storeInitialState.user.authenticated = authenticated;
  storeInitialState.user.user = user;
  storeInitialState.app.host = req.clientConfig.host;
  storeInitialState.app.site = req.clientConfig.site;*/

  const metaProperties = {
    title:'Link Preview',
    desc:'Open Graph, Twitter Card, Oembed preview',
    img: req.clientConfig.site + assetManifest['images/doggo.jpg'],
    imgAlt: "A dog with different eye color",
    url: 'https://linkpreview.dev',
    author: 'Namchey',
    authorUrl: 'https://namchey.com',
    type: 'summary',
    twitterCardType: 'summary_large_image',
    //embed
    embedLink: `${req.clientConfig.site}/embed`
  };

  const oembedUrl = `${req.clientConfig.site}`;

  metaProperties.xmlOembedLink = `<link rel="alternate" type="text/xml+oembed" href="${req.clientConfig.site}/api/oembed?url=${querystring.escape(oembedUrl)+'&amp;format=xml'}">`;
  metaProperties.jsonOembedLink = `<link rel="alternate" type="text/json+oembed" href="${req.clientConfig.site}/api/oembed?url=${querystring.escape(oembedUrl)+'&amp;format=json'}">`;

  const store = configureStore(storeInitialState, history);
  let routes = null;
  if(req.isEmbedView) {
    routes = createEmbedRoutes(store, {isServer: true, url: req.url, ip: req.ip});
    metaProperties.isEmbedView = true;
  } else {
    routes = createRoutes(store, {isServer: true, url: req.url, ip: req.ip});
  }

  //forward user agent;
  forwardHeaders({req, axios, authenticated, isStaging: __STAGING__});

  const headconfig = headconfigFactory(assetManifest);
  const initialState = store.getState();
  const currentUrl = req.url || '/';

  match({ routes, location: currentUrl }, (error, redirectLocation, renderProps) => {
    if (error) {
      postRenderError(error, currentUrl, 'react-router server-side-scrape');
      return renderContent({res, componentHTML: renderErrorPage(req, error), initialState, headconfig, chunkManifest, styles, scripts, metaProperties, status: 500});
    } else if (redirectLocation) {

      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {

      try {
        const InitialView = (
          <Provider store={store}>
            <RouterContext {...renderProps} />
          </Provider>
        );

        var componentHTML = renderToString(InitialView);
      } catch(error) {
        postRenderError(error, req.url);
        //render empty component and let client handle the rendering incase of server render error.
        return renderContent({res, componentHTML: renderErrorPage(req, error), initialState, headconfig, chunkManifest, styles, scripts, metaProperties, status: 500});
      }
      //This method waits for all render component promises to resolve before returning to browser
      preRenderMiddleware(store.dispatch, renderProps.components, renderProps.params, req)
        .then((data) => {
          return renderContent({res, componentHTML, initialState, headconfig, chunkManifest, styles, scripts, metaProperties});
        })
        .catch(error => {
          postRenderError(error, req.url, 'preRenderMiddleware-scrape');
          return renderContent({res, componentHTML, initialState, headconfig, chunkManifest, styles, scripts, metaProperties, status: 500});
        });
    } else {
      postRenderError(new Error('Not Found'), req.url, 'react-router server-render-scrape');
      return renderContent({res, componentHTML: render404Page({req}), initialState, headconfig, chunkManifest, styles, scripts, metaProperties, status: 404});
    }
  });

}
