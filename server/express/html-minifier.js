'use strict';

const { minify } = require('html-minifier');

module.exports = (app) => {
  //html minifier
  app.use((req, res, next) => {
    const opts = {
      removeComments:            true,
      collapseWhitespace:        true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes:     true,
      removeEmptyAttributes:     true,
      minifyJS:                  true
    };

    res.sendMinify = (html) => {
      res.send(minify(html, opts));
    };

    next();
  });
};