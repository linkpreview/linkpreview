'use strict';

const path = require('path'),
  i18n = require('i18n'),
  swig = require('swig'),
  accepts = require('accepts');

module.exports = (app) => {
  swig.setFilter('translate', require(path.resolve('./modules/application/services/swig/filter/translate')));
  swig.setFilter('moment', require(path.resolve('./modules/application/services/swig/filter/moment')));
  /*const mustache = require('i18n/node_modules/mustache');
   mustache.escape = function(value) {
   return value;
   };*/

  require(path.resolve('./server/translations/i18n/i18n.js'))(app);

  app.use((req, res, next) => {

    req.getLanguage = () => {
      if (req.language) return req.language;

      req.language = accepts(req).languages(['en', 'np']);
      if (!req.language) req.language = 'en';

      //error from mobile
      /*if (req.user) {
       req.language = req.user.getLang();
       } else {
       req.language = accepts(req).languages(['en', 'np']);
       if (!req.language) req.language = 'en';
       }*/

      return req.language;
    };

    // Translate to the language of the authenticated user
    req.translate = (id, variables) => {
      return i18n.__({phrase: id, locale: req.getLanguage()}, variables);
    };

    res.sendMessage = (id, variables, ...rest) => {
      return res.send({message: req.translate(id, variables), code: id, ...rest});
    };

    res.sendValidationMessage = (err) => {
      if (err.name === 'ValidationError') {
        for (const prop in err.errors) {
          err = err.errors[prop];
          break;
        }
      }

      if (!err.message) return next(err);

      return res.sendMessage(err.message, err);
    };

    // Sends an array of failed validation messages
    res.sendValidationMessages = function(err) {
      return res.send({messages: Object.keys(err.errors).map(function(prop) {
        return req.translate(err.errors[prop].message, err.errors[prop]);
      })});
    };

    // Sends an object(key-value pairs) of failed validation messages
    res.sendValidationErrors = function(err) {
      const errors = {};
      for (const field in err.errors) {
        errors[field] = req.translate(err.errors[field].message, err.errors[field]);
      }
      return res.send({errors: errors});
    };
    next();
  });
};
