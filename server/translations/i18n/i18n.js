'use strict';

var i18n = require('i18n');

module.exports = function(app, db) {
    i18n.configure({
        locales: ['en', 'np'],
        updateFiles: false,
        directory: __dirname +'/../languages'
    });
};
