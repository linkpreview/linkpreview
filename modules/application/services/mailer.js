'use strict';

const nodemailer = require('nodemailer'),
    path = require('path'),
    config = require(path.resolve('./server/config')),
    utmTrackingService = require(path.resolve('modules/application/services/utm-tracking')),
    Promise = require('promise'),
    _ = require('lodash'),
    fs = require('fs'),
    swig = require('swig'),
    i18n = require('i18n');

//donot show err self signed certificate

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let transportConfig = config.mailer.options;

//returns jsonMessage in test mode
if(config.isTest) {
  transportConfig = { jsonTransport: true }
}

const transport = nodemailer.createTransport(transportConfig);
/**
 * Sends a mail
 *
 * @param mail
 * @returns {Promise}
 */

exports.sendMail = function(mail) {
  mail = _.extend({
    from: config.mailer.from
  }, mail);

  //If (!mail.from) mail.from = config.mailer.from;

  return new Promise(function(resolve, reject) {
    transport.sendMail(mail, function(error) {
      if (error) return reject(error);

      resolve(mail);
    });
  });
};

/**
 * Sends HTML mail
 *
 * @param subject
 * @param template
 * @param variables
 * @param to
 * @param options
 * @returns {Promise}
 */
exports.send = function(subject, template, variables, to, options) {
  let _this = this;

  if (!options) options = {};
  options = _.extend({
    translateSubject: true,
    companyTitle: 'namchey',
    dualLang: false, // Whether use both language in translation
    language: 'en'
  }, options);

  variables = _.extend({
    appName: config.app.title,
    mailTitle: 'title.default_mail_title',
    site: config.app.site,
    logo: '',
    favicon: '',
    fluidIcon: '',
    iosIcon: '',
    //social icons
    fbLogo: '',
    mediumLogo: '',
    ytLogo: '',
    igLogo: '',
    twitterLogo: '',

    fbLink: '',
    mediumLink: '',
    ytLink: '',
    igLink: '',
    twitterLink: '',
    language: options.language
  }, variables);



  // Try to prepare translated subject
  if (options.dualLang) {
    const subjects = {
      en: i18n.__({phrase: subject, locale: 'en'}),
      np: i18n.__({phrase: subject, locale: 'np'})
    };
    if (subjects.en !== subjects.np) {
      subject = subjects.en + ' ' + subjects.np;
    } else {
      subject = subjects[options.language];
    }
  } else {
    if(options.translateSubject) {
      subject = i18n.__({phrase: subject, locale: options.language});
    }

  }

  return new Promise(function(resolve, reject) {
    swig.renderFile(template, variables, function(err, emailHtml) {
      if (err) return reject(err);
      const mail = {
        subject: subject,
        html: emailHtml
      };

      if(to) {
        mail.to = to;
      }

      if(options.bcc) {
        mail.bcc = options.bcc;
      }
      if (options.from) mail.from = options.from;
      return resolve(_this.sendMail(mail));
    });
  });
};
