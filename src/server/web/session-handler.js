
'use strict';

const errorCode = require('./error-code');
const helper    = require('./helper');
const Member    = require('./../database/member');
const Session   = require('./../database/session');

module.exports = (req, res, next) => {
	let sessionId;

	if (!(sessionId = helper.checkQueryEmpty(req, res, 'session', errorCode.loginNeeded, true)))
		return;

	Session.findOne({ session: sessionId }, (err, session) => {
		if (err) {
			console.error(err);
			helper.serverError(res);

			return;
		}

		if (!session) {
			helper.clientError(res, errorCode.sessionInvalid);
			return;
		}

		const now = Date.now();

		if (now - session.generatedTime > 900000) {
			helper.clientError(res, errorCode.loginExpired);
			return;
		}

		Member.findOne({ email: session.email }, (err, member) => {
			if (err) {
				console.error(err);
				helper.serverError(res);

				return;
			}

			if (!member) {
				session.remove(err => {
					if (err) {
						console.error(err);
						helper.serverError(res);

						return;
					}

					helper.clientError(res, errorCode.sessionInvalid);
				});

				return;
			}

			session.generatedTime = now;
			session.save(err => {
				if (err) {
					console.error(err);
					helper.serverError(res);

					return;
				}

				req.session = sessionId;
				req.member  = member;

				next();
			});
		});
	});
};