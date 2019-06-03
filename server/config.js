const Joi = require('joi');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision', 'CI'])
    .default('development'),
  PORT: Joi.number()
    .default(4040),
  HOST: Joi.string()
    .default('localhost'),
  HELMET_DISABLED: Joi.boolean()
    .default(false),
  SHOW_LOGS: Joi.boolean()
    .default(true),
  SITE: Joi.string()
    .allow(['https://linkpreview.dev', 'http://linkpreview.test'])
    .default('http://linkpreview.test'),
  DOMAIN: Joi.string()
    .allow(['linkpreview.dev', 'linkpreview.test'])
    .default('linkpreview.test'),
  WEBPACK_DEV_SERVER_PORT: Joi.number()
    .default(8181)
}).unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  host: envVars.HOST,
  domain: envVars.DOMAIN,
  helmetDisabled: envVars.HELMET_DISABLED,
  showLogs: envVars.SHOW_LOGS,
  app: {
    site: envVars.SITE,
    domain: envVars.DOMAIN
  },
  slack: {

  },
  webpack: {
    devServerPort: envVars.WEBPACK_DEV_SERVER_PORT
  }
};

config.isDev = config.env === 'development';
config.isProd = config.env === 'production';
config.isTest = config.env === 'test';
config.isProvision = config.env === 'provision';
config.isCI = config.env === 'CI';

module.exports = config;
