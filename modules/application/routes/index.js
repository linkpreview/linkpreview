'use strict';
const express = require('express');
const appRoutes = require('./application');

const router = express.Router();

router.use('/', appRoutes);

module.exports = router;
