
const express = require('express'),
  path = require('path');

module.exports = (app) => {

  const setCustomCacheControl = (res, path) => {
    res.setHeader('Cache-Control', 'private, must-revalidate, max-age=604800000');
  };

  app.use(express.static(path.resolve('public'), {
    etag: false,
    setHeaders: setCustomCacheControl
  }));

  app.use(express.static(path.resolve('static'), {
    etag: false,
    setHeaders: setCustomCacheControl
  }));

};
