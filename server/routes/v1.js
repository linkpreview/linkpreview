const path = require('path');
const express = require('express');

const { v1 } = require(path.resolve('./modules/scrape'));

const router = express.Router(); // eslint-disable-line new-cap

router.get('/health-check', (req, res) => {
  res.send('OK');
});

router.use('/scrape', v1);

module.exports = router;
