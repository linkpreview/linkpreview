
'use strict';
const path = require('path');
const express =require('express');
const CoreMiddlewares = require(path.resolve('server/express/middlewares'));
const config = require(path.resolve('./server/config'));
const controllers = require('../controllers/application');
const embedController = require('../controllers/oembed');
const scrapeController = require(path.resolve('modules/scrape/v1/controllers'));
const errorController = require('../controllers/errors');

const router = express.Router();
//oembed api specification
router.route('/api/oembed')
  .get(embedController.getEmbed);

router.route('/api/error/browser')
  .post(errorController.postBrowserError);

router.get('/embed', embedController.embedViewMiddleware, scrapeController.indexView);

router.get('/opensearch.xml', controllers.openSearch);

router.get('/sitemap.xml', controllers.sitemap);

router.get('/favicon.ico', controllers.favicon);

router.get('*', scrapeController.indexView);

module.exports = router;
