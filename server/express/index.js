const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const flash = require('express-flash');
const methodOverride = require('method-override');
const config = require(path.resolve('./server/config'));
const proxy = require('http-proxy-middleware');

//local deps
const errors = require('../routes/errors'),
  routes = require('../routes'),
  helmet = require('./helmet'),
  static = require('./static'),
  streams = require('./streams'),
  logs = require('./logs'),
  translations = require('./translations'),
  //expressBrute = require('./express-brute'),
  htmlMinifier = require('./html-minifier');

/**
 * Initialize the Express application
 */
exports.init =  (db) => {

  // Initialize express app
  const app = express();

  /**
   *host, port, site, domain config available for react server rendering and for axios
   * host - the server running the app, localhost or private ip address
   * port - port on which the server is running
   * site - full site address https://namchey.com
   * domain - top level domain name - namchey.com
   */

  app.use((req, res, next) => {
    req.clientConfig =  {host: config.host, port: config.port, site:config.app.site, domain: config.app.domain};
    req.reactVersion = '16.8.6';
    req.reactDOMVersion = '16.8.6';
    /*if(process.env.NODE_ENV === 'production') {
      req.ip = req.headers[events.REAL_IP_HEADER];
    }*/
    next();
  });

  if(config.isDev) {
    app.set('json spaces', 4);
  }

  app.set('port', (process.env.PORT || config.port));

  if (config.isProd) {
    app.locals.cache = 'memory';
  }

  logs(app);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
  app.use(methodOverride());

  htmlMinifier(app);

  static(app);

  //for proxing to webpack dev server to serve assets in dev mode.

  if(config.isDev) {
    console.log('webpack dev server port', config.webpack);
    app.use('/assets', proxy({target: `http://localhost:${config.webpack.devServerPort}`, changeOrigin: true}));
  }

  app.use(flash());

  translations(app);

  if(!config.helmetDisabled) {
    helmet(app);
  }

  streams(app);
  return app;
};


/**
 * Initialize the Express application for user server app
 */
module.exports.initApp = (db) => {
  // Initialize express app
  const app = exports.init();

  routes(app);

  errors(app);

  return app;
};
