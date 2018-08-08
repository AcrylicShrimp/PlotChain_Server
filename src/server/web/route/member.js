
'use strict';

const express = require('express');
const sha256  = require('sha256');
const router  = express.Router();

const helper    = require('./helper');
const errorCode = require('./error-code');
const Member    = require('./../../database/member');

router.post('/register', (req, res) => {
	let nickname;
	let email;
	let password;

	if (!(nickname = helper.checkBodyEmpty(req, res, 'nickname', errorCode.member.register.nicknameInvalid, true)))
		return;

	if (!(email = helper.checkBodyEmpty(req, res, 'email', errorCode.member.register.emailInvalid, true)))
		return;
		
	if (!(password = helper.checkBodyEmpty(req, res, 'password', errorCode.member.register.passwordInvalid, false)))
		return;
	
	Member.findOne({$or: [{'nickname': nickname}, {'email': email}]}, {_id: false, nickname: true}, (err, member) => {
		if (err) {
			console.error(err);
			helper.serverError(res);

			return;
		}

		if (member) {
			helper.clientError(res, member.nickname === nickname ?
				errorCode.member.register.nicknameAlreadyInUse: 
				errorCode.member.register.emailAlreadyInUse);
			return;
		}

		member          = new Member();
		member.nickname = nickname;
		member.email    = email;
		member.password = sha256(password);
		
		member.save(err => {
			if (err) {
				console.error(err);
				helper.serverError(res);
				
				return;
			}
			
			helper.success(res);
		});
	});
});
router.post('/login', (req, res) => {
	let email;
	let password;

	if (!(email = helper.checkBodyEmpty(req, res, 'email', errorCode.member.login.loginFailure, true)))
		return;

	if (!(password = helper.checkBodyEmpty(req, res, 'password', errorCode.member.login.loginFailure, false)))
		return;

	Member.findOne({email: email}, {_id: false, nickname: true, email: true, password: true}, (err, member) => {
		if (err) {
			console.error(err);
			helper.serverError(res);
			
			return;
		}

		if (!member) {
			helper.clientError(res, errorCode.member.login.loginFailure);
			return;
		}

		if (member.password !== sha256(password)) {
			helper.clientError(res, errorCode.member.login.loginFailure);
			return;
		}

		helper.success(res, {
			session: 'THIS_IS_FAKE_SESSION_ID'
		});
	});
});

module.exports = router;