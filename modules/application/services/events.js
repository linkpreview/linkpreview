const path = require('path'),
      Slack = require('slack-node'),
      logger = require(path.resolve('./server/bunyan-logger')),
      AppEmitter = require('./emitter'),
      debug = require('debug')('events'),
      useragent = require('useragent'),
      slackLogger = require('./slack'),
      utmTrackingService = require('./utm-tracking'),
      appConfig = require(path.resolve('server/config'));

const userActivityURI = appConfig.slack.userActivityURI;
const bugWebhookURI = appConfig.slack.bugWebhookURI;

/**
 * Taken from nginx config. app-proxy-params.conf
 * All headers are in lowercase
 * https://gitlab.com/bring2dip/namchey-infra/blob/std/provision/webserver/conf/app-proxy-params.conf
 * @type {string}
 */
const REAL_IP_HEADER = 'x-real-ip';

exports.REAL_IP_HEADER = REAL_IP_HEADER;

exports.getAgentInfo = (req) => {
  const agent = useragent.parse(req.headers['user-agent']);

  const agentInfo = {
    browser: agent.family,
    browserVersion:agent.toVersion(),
    os: agent.os.family,
    osVersion: agent.os.toVersion(),
    device: agent.device.family,
    deviceVersion: agent.device.toVersion()
  };

  return agentInfo;
};

AppEmitter.on('error', (error) => {
  logger.error(error);
  slackLogger.logError(error, {}, 'EventEmitter Error');
});

exports.publish = (config, req) => {

    /* sample config object
    {
     action: 'viewed',
     type: 'index'
     };
     */

    const agentInfo = exports.getAgentInfo(req);

    AppEmitter.emit(`${config.type}-${config.action}`, config, req);

    if(config.isDev) {
      console.log('User Activity: ');
      console.log(JSON.stringify({...config, ...agentInfo}));
    }

    //slack notification
    const filteredConfig = {
      ip: req.headers[REAL_IP_HEADER],
      action: config.action,
      type: config.type,
      referrer: req.query.referrer || req.headers['referer'],
      [config.type]: config[config.type] ?  config[config.type]._id : '',
      user: (config.user && config.user.username) || (req.user ?  req.user.username : 'Guest'),
      ...agentInfo
    };

    if(req.query.crawler) {
      filteredConfig.crawler = req.query.crawler;
    }

    if(config.query) {
      filteredConfig.query = config.query;
    }

    if(config.isProd) {
      slackLogger.logActivity(filteredConfig);
    }

    utmTrackingService.track({req, config, agentInfo});
    
};
