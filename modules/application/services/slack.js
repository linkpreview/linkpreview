const Slack = require('slack-node'),
  path = require('path'),
  { REAL_IP_HEADER } = require('./events'),
  config = require(path.resolve('server/config'));

const userActivityURI = config.slack.userActivityURI;
const bugWebhookURI = config.slack.bugWebhookURI;

const bugSlack = new Slack();
bugSlack.setWebhook(bugWebhookURI);

const userActivitySlack = new Slack();
userActivitySlack.setWebhook(userActivityURI);

/**
 * Log Bugs in Slack
 * @param name
 * @param req
 * @param error
 */
exports.logError = (error, req, name) => {
  bugSlack.webhook({
    channel: config.slackBugChannel,
    username: config.slackUsername,
    text: JSON.stringify({name, url: req.originalUrl, ip:req.headers[REAL_IP_HEADER], stack: error.stack, message: error.message})
  }, function(err, response) {
  });
};

/**
 * Internal process error
 * @param error
 * @param req
 * @param name
 */
exports.logInternalError = (error, name) => {
  bugSlack.webhook({
    channel: config.slackBugChannel,
    username: config.slackUsername,
    text: JSON.stringify({name, stack: error.stack, message: error.message})
  }, function(err, response) {
  });
};

/**
 * Log User Activity
 * @param activity
 * @param req
 */
exports.logActivity = (activity, req) => {
  userActivitySlack.webhook({
    channel: config.slackUserChannel,
    username: config.slackUsername,
    text: JSON.stringify(activity)
  }, function(err, response) {
  });
};
