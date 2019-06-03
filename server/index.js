'use strict';

const path = require('path');
const config = require('./config');
const fs = require('fs');
const http = require('http');
const logger = require('./bunyan-logger');
const gracefulShutdown = require('http-graceful-shutdown');
const slackService = require(path.resolve('modules/application/services/slack'));
const express = require('./express');


Promise.resolve({}).then(() => {
	const extendFunction = require(path.resolve('app/utils/extend_functions'));
	// Bootstrap application settings
	const app = express.initApp();

	console.log('Env: ' + config.env);
	console.log('Engine: ' + config.appEngine);

	const httpServer = http.createServer(app);

	httpServer.listen(config.port, config.host, () => {
		console.log('Server listening on port, host:', app.get('port'), config.host);
	});


// this enables the graceful shutdown with advanced options
	gracefulShutdown(httpServer,
		{
			//default timeout
			//timeout: 30000,
			development: config.isDev,
			onShutdown: cleanup,
			finally: function() {
				console.log('Server shutted down..');
			}
		}
	);

}).catch((err) => {
	slackService.logInternalError(err, 'server entry error');
	if(config.isDev) {
		return console.error(err);
	}
	logger.error(err);
});

//for catching unhandled promise rejection
process.on('unhandledRejection', (reason, p) => {
	logger.error('Unhandled Rejection at:', p, 'reason:', reason);
});

/**
 * Gracefull shutdown
 */

// cleanup function
function cleanup() {
	//close db connection or any other connection
	return new Promise((resolve, reject) => {
		resolve();
	});

}
