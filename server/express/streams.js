'use strict';

module.exports =  (app) => {
  app.use('/api/streams/*', (req, res, next) => {
    res.set('Content-Type', 'application/json');
  });
};
