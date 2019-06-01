'use strict';

var i18n = require('i18n');

function translate(input, language, variables) {
  return i18n.__({phrase: input, locale: language}, variables);
}

translate.safe = true;

module.exports = translate;
