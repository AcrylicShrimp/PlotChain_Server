
'use strict';

const express = require('express');
const router  = express.Router();

const errorCode      = require('./../error-code');
const helper         = require('./../helper');
const sessionHandler = require('./../session-handler');

router.post('/register', sessionHandler, (req, res) => {
	if (req.member.writer) {
		helper.clientError(res, errorCode.alreadyWriter);
		return;
	}

	req.member.writer = true;
	req.member.save(err => {
		if (err) {
			console.error(err);
			helper.serverError(res);

			return;
		}

		helper.success(res);
	});
});

module.exports = router;