const express = require('express');
const v1Routes = require('./v1/routes');
//const v2Routes = require('./v2/routes');

const v1 = express.Router(); // eslint-disable-line new-cap
v1.use('/', v1Routes);

//const v2 = express.Router();
//v2.use('/', v2Routes);

module.exports = { v1 };
