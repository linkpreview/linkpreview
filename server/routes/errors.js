'use strict';

const path = require('path'),
  errorsController = require(path.resolve('modules/application/controllers/errors'));

module.exports = (app) => {

  app.use((req, res, next) => {
    req.on('error', (err) => {
      res.end();
    });
    next();
  });

  app.use('/api', errorsController.apiErrors);

  app.use(errorsController.redirectToServerError);

  // Assume 404 since no middleware responded for API
  app.use('/api', errorsController.noApiMiddlewareResponded);

  // Assume 404 since no middleware responded
  app.use(errorsController.noMiddlewareResponded);
};
