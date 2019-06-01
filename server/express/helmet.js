'use strict';

const helmet = require('helmet');
const path = require('path');
const config = require(path.resolve('server/config'));

const self = ["'self'"];
const devHosts = [`localhost:4000`, 'localhost', `*.localhost:4000`];
const servers = ['linkpreview.dev', config.domain];
const dataSrc = ['data:'];

let common = [...dataSrc, ...self, ...servers, '*.googleapis.com', '*.bootstrapcdn.com'];
if(config.isDev || config.isTest) {
  common = common.concat(devHosts);
}

const youtubeSrc = '*.youtube.com';
const facebookSrc = '*.facebook.com';
const vimeoSrc = '*.vimeo.com';
const webArchiveSrc = '*.archive.org';
let domainConnectSources = [];

if(config.isDev) {

  domainConnectSources = [
    `${config.host}:8080`,
    `ws://${config.host}:8080`,
  ]
}

module.exports = (app) => {
  // Use helmet to secure Express headers
  const SIX_MONTHS = 15778476000;
  if(!config.skipCSP) {
    app.use(helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: common,
        connectSrc: [...common, 'www.google-analytics.com',...domainConnectSources],
        fontSrc: [...common, 'fonts.gstatic.com'],
        scriptSrc: [...common, "'unsafe-inline'", 'www.google-analytics.com', 'cdn.ravenjs.com', 'cdnjs.cloudflare.com', '*.spedcheck.space', '*.amazonaws.com', 'https://unpkg.com'],
        styleSrc: [...common, 'cdnjs.cloudflare.com', "'unsafe-inline'", 'blob:'],
        //imgSrc: [...common, 'blob:', 'storage.googleapis.com', 'maps.gstatic.com', 'www.google-analytics.com', '*.fbcdn.net', '*.facebook.com', '*.googleusercontent.com', '*.fbsbx.com'],
        //mediaSrc: [...common, youtubeSrc, facebookSrc, vimeoSrc],
        //frameSrc: [...common, youtubeSrc, facebookSrc, vimeoSrc, webArchiveSrc, khaltiSrc],
        //frameAncestors: [...common, youtubeSrc, facebookSrc, vimeoSrc, webArchiveSrc, khaltiSrc],
        //childSrc: [...self,youtubeSrc, facebookSrc, vimeoSrc, webArchiveSrc],
        //sandbox: ['allow-forms', 'allow-scripts', 'allow-same-origin'],
        reportUri: '/csp-report-violation'
      }
    }));
  }


  //prevents clickjacking
  //app.use(helmet.frameguard());
  //this is preventing the embed feature

  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.use(helmet.hsts({
    maxAge: SIX_MONTHS,
    includeSubdomains: true,
    force: true
  }));
  app.disable('x-powered-by');
};
