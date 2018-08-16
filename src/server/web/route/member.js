
'use strict';

const emailValidator = require('email-validator');
const express        = require('express');
const sha256         = require('sha256');
const uuid           = require('uuid');
const router         = express.Router();

const errorCode      = require('./../error-code');
const helper         = require('./../helper');
const sessionHandler = require('./../session-handler');
const Member         = require('./../../database/member');
const Session        = require('./../../database/session');

router.post('/', (req, res) => {
	let nickname;
	let email;
	let password;

	if (!(nickname = helper.checkBodyEmpty(req, res, 'nickname', errorCode.nicknameInvalid, true)))
		return;

	if (!(email = helper.checkBodyEmpty(req, res, 'email', errorCode.emailInvalid, true)))
		return;

	if (!(password = helper.checkBodyEmpty(req, res, 'password', errorCode.passwordInvalid, false)))
		return;

	if (!emailValidator.validate(email)) {
		helper.clientError(res, errorCode.emailInvalid);
		return;
	}

	Member.findOne({ $or: [{ 'nickname': nickname }, { 'email': email }] }, { _id: false, nickname: true }, (err, member) => {
		if (err) {
			console.error(err);
			helper.serverError(res);

			return;
		}

		if (member) {
			helper.clientError(res, member.nickname === nickname ?
				errorCode.nicknameAlreadyInUse: 
				errorCode.emailAlreadyInUse);
			return;
		}

		member          = new Member();
		member.nickname = nickname;
		member.email    = email;
		member.password = sha256(password);
		member.writer   = false;

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

router.post('/session', (req, res) => {
	let email;
	let password;

	if (!(email = helper.checkBodyEmpty(req, res, 'email', errorCode.loginFailure, true)))
		return;

	if (!(password = helper.checkBodyEmpty(req, res, 'password', errorCode.loginFailure, false)))
		return;

	Member.findOne({ email: email, password: sha256(password) }, { _id: false, nickname: true, email: true, password: true }, (err, member) => {
		if (err) {
			console.error(err);
			helper.serverError(res);

			return;
		}

		if (!member) {
			helper.clientError(res, errorCode.loginFailure);
			return;
		}

		Session.findOne({ email: email }, (err, session) => {
			if (err) {
				console.error(err);
				helper.serverError(res);

				return;
			}

			if (!session)
				session = new Session();

			session.session       = sha256(uuid.v4());
			session.email         = email;
			session.generatedTime = Date.now();
			session.save(err => {
				if (err) {
					console.error(err);
					helper.serverError(res);

					return;
				}

				helper.success(res, {
					session: session.session
				});
			});
		});
	});
});

router.delete('/session', sessionHandler, (req, res) => {
	Session.findOne({ session: req.session }, (err, session) => {
		if (err) {
			console.error(err);
			helper.serverError(res);

			return;
		}

		if (!session) {
			helper.clientError(res, errorCode.sessionInvalid);
			return;
		}

		session.remove(err => {
			if (err) {
				console.error(err);
				helper.serverError(res);

				return;
			}

			helper.success(res);
		});
	});
});

module.exports = router;