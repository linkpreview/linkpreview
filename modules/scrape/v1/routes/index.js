'use strict';
const express = require('express');
const path = require('path');
const controller = require('../controllers');

const router = express.Router();

router.route('/')
    .get(controller.scrape);

module.exports = router;
