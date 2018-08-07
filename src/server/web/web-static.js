
'use strict';

const path        = require('path');
const express     = require('express');
const serveStatic = require('serve-static');
const router      = express.Router();

router.use(serveStatic(path.join(__dirname, '../../client'), {
	index: '/landing/landing.html'
}));

module.exports = router;