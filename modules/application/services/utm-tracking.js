const path = require('path'),
  logger = require(path.resolve('./server/bunyan-logger')),
  slackLogger = require('./slack');

exports.track = ({req, config, agentInfo}) => {
  if(config.query) {

    if(!config.query.utm_source && !req.query.utm_source) return;
    if(!config.query.utm_medium && !req.query.utm_medium) return;
    if(!config.query.utm_campaign && !req.query.utm_campaign) return;

    const utm_source = config.query.utm_source || req.query.utm_source;
    const utm_medium = config.query.utm_medium || req.query.utm_medium;
    const utm_campaign = config.query.utm_campaign || req.query.utm_campaign;
    const utm_content = config.query.utm_content || req.query.utm_content;
    const utm_term = config.query.utm_term || req.query.utm_term;

    const utmDoc = {
      source: utm_source,
      medium: utm_medium,
      campaign: utm_campaign,
      content: utm_content,
      term: utm_term,
      ...agentInfo
    };
    slackLogger.logActivity(utmDoc, req);
  }
};

exports.getEmailUtmFields = ({source = 'email_notification', campaign = 'notification'}) => {
  return `utm_source=${source}&utm_medium=email&utm_campaign=${campaign}`
};
