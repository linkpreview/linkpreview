'use strict';

const path = require('path'),
  config = require(path.resolve('./server/config')),
  cors = require('cors');


const { URL } = require('url');

function searchStringInArray (str, strArray) {
  for (let j=0; j<strArray.length; j++) {
    if (strArray[j].match(str)) return j;
  }
  return -1;
}

/**
 * Get hostname from url
 * if it contains subdomain, strip the subdomain part and only send domain part
 * @param origin
 * @returns {*}
 */
exports.getDomainFromOrigin = (origin) => {
  if(!origin) return '';
  const originUrl = new URL(origin);
  const hostname = originUrl.hostname;
  const domainParts = hostname.split('.');
  //if https://localhost => localhost => localhost
  if(domainParts.length === 1) {
    return domainParts[0];
  }
  //if subdomain in localhost return localhost
  if(domainParts[1] === 'localhost') {
    return domainParts[1];
  }
  //https://cards-dev.twitter.com => cards-dev, twitter, com => twitter.com
  //https://www.medium.com => www, medium, com => medium.com
  //return the last and second last element of the array which is the domain name
  const domainName = [domainParts[domainParts.length-2], domainParts[domainParts.length-1]];
  return domainName.join('.');
};

module.exports = (app) => {
  const defaultWhiteList = require(path.resolve('./server/cors/whitelist')).whitelist;
  const domainWhiteList = config.domains;
  const whiteList = defaultWhiteList.concat(domainWhiteList);
  const corsOptionsDelegate = function (req, callback) {
    const corsOptions  = { methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], optionsSuccessStatus: 200 };
    const origin = req.headers['origin'];
    const originHostName = exports.getDomainFromOrigin(origin);
    if(!originHostName) {
      corsOptions.origin = false;
      return callback(null, corsOptions);
    }

    if (searchStringInArray(originHostName, whiteList) !== -1) {
      corsOptions.origin = origin; // reflect (enable) the requested origin in the CORS response
      corsOptions.credentials = true;
    } else {
      corsOptions.origin = false; // disable CORS for this request
    }
    callback(null, corsOptions);// callback expects two parameters: error and options
  };

  app.options('*', cors(corsOptionsDelegate));

  app.use(cors(corsOptionsDelegate));

  //set origin header in response for cors to work in firefox
  app.use((req, res, next) => {
    const origin = req.headers['origin'];
    if(origin) {
      res.setHeader('Origin', origin);
    }
    next();
  });
};
