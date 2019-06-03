'use strict';

/**
 * Module dependencies.
 */
const path = require('path'),
      fs = require('fs'),
      requestPromise = require('request-promise'),
      cheerio = require('cheerio'),
      suq = require('suq'),
      config = require(path.resolve('server/config'));

const { errorView } = require(path.resolve('modules/application/controllers/application'));

const checkFileExists = (path) => {
    return fs.existsSync(path);
};

/**
 * Last Resort. When nodejs cannot find the compiled server assets
 * @param res
 */
const siteUpgrading = (res) => {
    return res.status(500).json({message: 'Site Upgrading'});
};


exports.indexView = [
  function(req, res, next) {
    let compiled_app_module_path = path.resolve('public', 'assets', 'scrape.server.js');
    if(config.isProd || config.isCI) {
        compiled_app_module_path = path.resolve('public', 'server-assets', 'scrape.server.js');
    }

    if(!checkFileExists(compiled_app_module_path)) {
      return errorView('static/500.html')(req, res, next);
    }

    const App = require(compiled_app_module_path);

    if(config.isProd) {
        const assetManifest = require(path.resolve('public', 'assets', 'asset-manifest.json'));
        const chunkManifestPath = path.resolve('public', 'assets', 'chunk-manifest.json');
        let chunkManifest = {};
        if(checkFileExists(chunkManifestPath)) {
          chunkManifest = require(chunkManifestPath);
        }
        App.default(req, res, next, assetManifest, chunkManifest);
    } else {
        App.default(req, res, next, {}, {});
    }

}];

//TODO use redis
//support for 50 items
const cache = {items: {}}
/**
* Handle GET request
* scrape
*/
  exports.scrape = (req, res, next) => {
    if(!req.query.url) {
      return res.status(400).json({message: 'url is required', code: 'EMPTY_URL'});
    }

    suq(req.query.url, (err, json, body) => {
        if(err) {
          return res.status(500).json(err);
        }

        const $ = cheerio.load(body);
        const $head = $('head');
        json.head = [];
        $head.children().each((i, el) => {
          const $el = $(el);

          json.head.push($el.attr());
          //return { ...$el.attr()};
          //console.log($el)
          //console.log($el.attr());
          /*if ($el.attr('name') && $el.attr('content')) {
            result[$el.attr('name')] = $el.attr('content');
          }*/
        });
        json.url = req.query.url;
        const oembed = json.oembed;
        if(oembed.formats.length === 0) {
          return res.status(200).json({json, body});
        }

        let uri = null;
        if(oembed.json) {
          uri = oembed.json;
        }
        /*
        TODO support xml data fetching as well
        if(!oembed.json && oembed.xml) {
          uris.push(oembed.xml);
        }
        */

        //const requestOptions = {uri: oembed && oembed[oembed.formats[0]]}
        requestPromise({uri}).then(res => {
          json.oembed.body = res;
          res.status(200).json({json, body});
        }).catch(err => {
          json.oembed.error = err;
          res.status(200).json({json, body});
        });

    });
  };

//TODO
//clears single url from cache object
  exports.clearCache = (req, res, next) => {

  }
//TODO
//empty cache object
  exports.flushCache = (req, res, next) => {

  }
