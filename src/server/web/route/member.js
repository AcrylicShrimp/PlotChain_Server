
'use strict';

const emailValidator = require('email-validator');
const express        = require('express');
const sha256         = require('sha256');
const uuid           = require('uuid');
const router         = express.Router();

const errorCode         = require('./../error-code');
const helper            = require('./../helper');
const sessionHandler    = require('./../session-handler');
const totalHeartHandler = require('./../total-heart-handler');
const Heart             = require('./../../database/heart');
const History           = require('./../../database/history');
const Member            = require('./../../database/member');
const Novel             = require('./../../database/novel');
const Session           = require('./../../database/session');

function joinNovelWithIsHeart(member, query, callback) {
	query.exec((err, novel) => {
		if (err) {
			callback(err, null);
			return;
		}

		Heart.findOne({ novel: novel.id, nickname: member.nickname }, { _id: true }, (err, heart) => {
			if (err) {
				callback(err, null);
				return;
			}

			novel.isHeart = heart ? true : false;

			callback(null, novel);
		});
	});
}

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
		
	if (!emailValidator.validate(email)) {
		helper.clientError(res, errorCode.emailInvalid);
		return;
	}

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
					nickname: member.nickname,
					session : session.session
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

router.get('/history', sessionHandler, totalHeartHandler, (req, res) => {
	History.find({ reader: req.member.nickname }, { _id: false, novel: true, episode: true, readDate: true }).sort({ readDate: -1 }).exec((err, history) => {
		if (err) {
			console.error(err);
			helper.serverError(res);

			return;
		}

		const list = [];

		function findNovelAt(index) {
			if (index === history.length) {
				helper.success(res, {
					totalHeart: req.totalHeart,
					history   : list
				});

				return;
			}

			joinNovelWithIsHeart(req.member, Novel.findOne({ id: history[index].novel }, { _id: false, id: true, name: true, color: true, author: true, genre: true, state: true, heart: true, introduction: true, episodeCount: true, createdDate: true, updatedDate: true }), (err, novel) => {
				if (err) {
					console.error(err);
					helper.serverError(res);

					return;
				}

				if (novel)
					list.push({
						novel: {
							isHeart     : novel.isHeart,
							id          : novel.id,
							name        : novel.name,
							color       : novel.color,
							author      : novel.author,
							genre       : novel.genre,
							state       : novel.state,
							heart       : novel.heart,
							introduction: novel.introduction,
							episodeCount: novel.episodeCount,
							createdDate : novel.createdDate,
							updatedDate : novel.updatedDate
						},
						episode : history[index].episode,
						readDate: history[index].readDate
					});

				findNovelAt(++index);
			});
		}

		findNovelAt(0);
	});
});

module.exports = router;