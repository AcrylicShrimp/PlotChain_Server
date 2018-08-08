
'use strict';

const express = require('express');
const router  = express.Router();

const helper         = require('./../helper');
const sessionHandler = require('./../session-handler');

router.use(sessionHandler);
router.post('/getLoginData', (req, res) => {
	helper.success(res, {
		member: req.member
	});
});

module.exports = router;