
'use strict';

const express = require('express');
const sha256  = require('sha256');
const router  = express.Router();

const errorCode = require('./error-code');
const Member    = require('./../../database/member');

router.post('/register', (req, res) => {
	if (req.body.nickname)
		req.body.nickname = req.body.nickname.trim();

	if (req.body.email)
		req.body.email = req.body.email.trim();
		
	if (req.body.password)
		req.body.password = req.body.password.trim();

	if (!req.body.nickname || req.body.nickname.length === 0) {
		res.status(400).json({
			success  : false,
			errorCode: errorCode.member.register.nicknameInvalid
		});

		return;
	}
	
	if (!req.body.email || req.body.email.length === 0) {
		res.status(400).json({
			success  : false,
			errorCode: errorCode.member.register.emailInvalid
		});
		
		return;
	}

	if (!req.body.password || req.body.password.length === 0) {
		res.status(400).json({
			success  : false,
			errorCode: errorCode.member.register.passwordInvalid
		});

		return;
	}
	
	Member.findOne({$or: [{'nickname': req.body.nickname}, {'email': req.body.email}]}, (err, member) => {
		if (err) {
			console.error(err);

			res.status(500).json({
				success  : false,
				errorCode: errorCode.serverError
			});
			
			return;
		}

		if (member) {
			res.status(400).json({
				success  : false,
				errorCode: member.nickname === req.body.nickname ? errorCode.member.register.nicknameAlreadyInUse: errorCode.member.register.emailAlreadyInUse
			});

			return;
		}

		member          = new Member();
		member.nickname = req.body.nickname;
		member.email    = req.body.email;
		member.password = sha256(req.body.password);
		
		member.save(err => {
			if (err) {
				console.error(err);

				res.status(500).json({
					success  : false,
					errorCode: errorCode.serverError
				});

				return;
			}
			
			res.status(200).json({
				success  : true,
				errorCode: 0
			});
		});
	});
});

module.exports = router;