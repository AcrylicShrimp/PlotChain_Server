
'use strict';

const express = require('express');
const router  = express.Router();

const errorCode      = require('./../error-code');
const helper         = require('./../helper');
const sessionHandler = require('./../session-handler');
const Counter        = require('./../../database/counter');
const Heart          = require('./../../database/heart');
const Novel          = require('./../../database/novel');

router.post('/', sessionHandler, (req, res) => {
	let id;
	
	if (!(id = helper.checkQueryEmpty(req, res, 'id', errorCode.novelIdInvalid, true)))
		return;

	Novel.findOne({ id: id }, { _id: true, heart: true }, (err, novel) => {
		if (err) {
			console.error(err);
			helper.serverError(res);

			return;
		}

		if (!novel) {
			helper.clientError(res, errorCode.novelIdInvalid);
		}

		Heart.findOne({ novel: id, nickname: req.member.nickname }, { _id: true }, (err, heart) => {
			if (err) {
				console.error(err);
				helper.serverError(res);

				return;
			}

			if (heart) {
				helper.success(res);
				return;
			}

			heart          = new Heart();
			heart.novel    = id;
			heart.nickname = req.member.nickname;
			heart.save(err => {
				if (err) {
					console.error(err);
					helper.serverError(res);

					return;
				}

				++novel.heart;
				novel.save(err => {
					if (err) {
						console.error(err);
						helper.serverError(res);

						return;
					}
										
					Counter.nextSeq('hearts', (err, seq) => {
						if (err) {
							console.error(err);
							helper.serverError(res);

							return;
						}

						helper.success(res);
					});
				});
			});
		});
	});
});

router.delete('/', sessionHandler, (req, res) => {
	let id;

	if (!(id = helper.checkQueryEmpty(req, res, 'id', errorCode.novelIdInvalid, true)))
		return;

	Novel.findOne({ id: id }, { _id: true, heart: true }, (err, novel) => {
		if (err) {
			console.error(err);
			helper.serverError(res);

			return;
		}

		if (!novel) {
			helper.clientError(res, errorCode.novelIdInvalid);
		}

		Heart.findOne({ novel: id, nickname: req.member.nickname }, { _id: true }, (err, heart) => {
			if (err) {
				console.error(err);
				helper.serverError(res);

				return;
			}

			if (!heart) {
				helper.success(res);
				return;
			}
			
			heart.remove(err => {
				if (err) {
					console.error(err);
					helper.serverError(res);

					return;
				}

				--novel.heart;
				novel.save(err => {
					if (err) {
						console.error(err);
						helper.serverError(res);

						return;
					}

					Counter.prevSeq('hearts', (err, seq) => {
						if (err) {
							console.error(err);
							helper.serverError(res);

							return;
						}

						helper.success(res);
					});
				});
			});
		});
	});
});

module.exports = router;