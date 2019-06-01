
'use strict';
const path = require('path');
const express =require('express');
const config = require(path.resolve('./server/config'));
const errors = require('../controllers/errors');

const router = express.Router();


module.exports = router;
