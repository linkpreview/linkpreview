'use strict';

const path = require('path'),
    HttpException = require(path.resolve('./modules/application/rest/http-exception')),
    PromiseValidationError = require(path.resolve('./modules/application/rest/promise-validation-error')),
    Slack = require('slack-node'),
    config = require(path.resolve('server/config')),
    events = require(path.resolve('modules/application/services/events')),
    debug = require('debug')('errors'),
    logger = require(path.resolve('./server/bunyan-logger'));

const bugWebhookURI = config.slack.bugWebhookURI;

const bugSlack = new Slack();
bugSlack.setWebhook(bugWebhookURI);

/**
 * @param err
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.apiErrors = (err, req, res, next) => {
  // If the error object doesn't exists
  if(err === undefined) {
    debug('promise breaker');
    return;
  }

  if (!err) return next();

  if(res.headersSent) {
     return exports.logError(req, err);
  }

  if (err instanceof HttpException) {
    return res.status(err.statusCode).sendMessage(err.message);
  }

  if(err instanceof PromiseValidationError) {
    return res.status(err.statusCode).sendMessage(err.message);
  }

  if (err.name === 'ValidationError') {
    if (config.isProd) {
      exports.logError(req, err);
    }
    const firstValidationField = Object.keys(err.errors)[0];    
    return res.status(400).sendMessage(`validation.failed.${firstValidationField}`);
  }

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    if (config.isProd) {
      exports.logError(req, err);

      return res.status(404).sendMessage('not_found');
    }

    return res.status(400).sendMessage('cast_error', null,
      {
        model: err.model.modelName,
        stringValue: err.stringValue,
        kind: err.kind,
        value: err.value,
        path: err.path,
        reason: err.reason
      }
    );

  }

  if(err.status === 404) {
    exports.logError(req, err);
    return res.status(404).sendMessage(err.message || 'not_found');
  }

  if(err.status === 400) {

    exports.logError(req, err);

    return res.status(400).sendMessage(err.message || 'not_found');
  }

  // Log it
  exports.logError(req, err);

  if(config.isProd) {
    return res.status(500).sendMessage('internal_server_error');
  }

  res.status(500).sendMessage('internal_server_error', null, {msg: err.message, stack: err.stack});

};

exports.redirectToServerError = (err, req, res, next) => {
  // If the error object doesn't exists
  if (!err) return next();

  if(res.headersSent) {
     return exports.logError(req, err);
  }

  // Log it
  exports.logError(req, err);
  // Redirect to error page
  if(config.isProd) {
    return res.status(500).json({message:'internal_server_error'});
  }

  res.status(500).json({message: err.message, stack: err.stack});
};

exports.noApiMiddlewareResponded = (req, res) => {
  if(res.headersSent) {
     return exports.logError(req, new Error('noApiMiddlewareResponded'));
  }

  if (config.isProd) {
      exports.logError(req, new Error(`noAPIMiddlewareResponded: ${req.url}`));
      return res.status(404).sendMessage('not_found');
  }
  return res.status(404).sendMessage('noApiMiddlewareResponded. Please see the API for reference');
};

/**
 * POST
 * Browser Error handler
 * @param req
 * @param res
 * @param next
 */

exports.postBrowserError = (req, res, next) => {
  exports.logBrowserError(req, req.body);
  res.status(200).json({message: 'ok'});
};

exports.noMiddlewareResponded = (req, res) => {
  if(res.headersSent) {
     return exports.logError(req, new Error('noMiddlewareResponded'));
  }

  if (config.isProd) {
      exports.logError(req, new Error(`noMiddlewareResponded: ${req.url}`));
      return res.status(404).sendMessage('not_found');
  }
  return res.status(404).sendMessage('noMiddlewareResponded. Please see the API for reference');
};

exports.logError = (err, req) => {

  if(!err instanceof Error) {
    if(config.isDev || config.isTest) {
      throw Error('err object should be instance of error');
    }
  }

  if (config.isProd) {
    logger.error(err);

    const agentInfo = events.getAgentInfo(req);
    let slackString = '';
    try {
      slackString = JSON.stringify({url: req.originalUrl, stack: err && err.stack, ...agentInfo});
    }catch(err) {
      return logger.error(err);
    }

    bugSlack.webhook({
      channel: config.slackBugChannel,
      username: config.slackUsername,
      text: slackString
    }, function(err, response) {

      if(err) {
        return logger.error(err);
      }

      if(response.statusCode !== 200) {
        return logger.error(new Error(`slack_response_error: ${response.response}`));
      }
    });
  } else {
    console.log(err);
  }

};

/**
 * Log browser error in log file and slack
 * @param req
 * @param body
 */
exports.logBrowserError = (body = {}, req) => {
  if (config.isProd) {
    const fileLogContents = { ...body };

    //delete screenshot field for loggin in file
    if(fileLogContents.screenshot) {
      delete fileLogContents.screenshot;
    }

    logger.warn(fileLogContents, 'browser-error');

    //save to database
    const agentInfo = events.getAgentInfo(req);
    let slackString = '';

    try {
      slackString = JSON.stringify({...fileLogContents, user: req.user && req.user.username})
    }catch(err) {
      return logger.error(err);
    }

    bugSlack.webhook({
      channel: config.slackBugChannel,
      username: config.slackUsername,
      text: slackString
    }, (err, response) => {
      if(err) {
        return logger.error(err);
      }
      if(response.statusCode !== 200) {
        return logger.error(new Error(`slack_response_error: ${response.response}`));
      }
    });

  } else {
    //delete screenshot dataURL for not polluting the console
    delete body.screenshot;
    console.log('browser-error');
    console.error(body);
    return;
  }

};
