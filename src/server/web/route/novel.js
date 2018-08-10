
'use strict';

const express = require('express');
const router  = express.Router();

const errorCode      = require('./../error-code');
const helper         = require('./../helper');
const sessionHandler = require('./../session-handler');
const Counter        = require('./../../database/counter');
const Episode        = require('./../../database/episode');
const Novel          = require('./../../database/novel');

router.post('/create', sessionHandler, (req, res) => {
	if (!req.member.writer) {
		helper.clientError(res, errorCode.writerNeeded);
		return;
	}

	let name;
	let introduction;

	if (!(name = helper.checkBodyEmpty(req, res, 'name', errorCode.novelNameInvalid, true)))
		return;

	if (!(introduction = req.body.introduction))
		introduction = '';

	Novel.find({ author: req.member.nickname }, (err, novel) => {
		if (err) {
			console.error(err);
			helper.serverError(res);

			return;
		}

		if (novel.length >= 3) {
			helper.clientError(res, errorCode.novelToomany);
			return;
		}

		Counter.nextSeq('novels', (err, seq) => {
			if (err) {
				console.error(err);
				helper.serverError(res);

				return;
			}

			novel              = new Novel();
			novel.id           = seq;
			novel.name         = name;
			novel.author       = req.member.nickname;
			novel.introduction = introduction;
			novel.episodeCount = 0;
			novel.createdDate  = novel.updatedDate = Date.now();
			novel.save(err => {
				if (err) {
					console.error(err);
					helper.serverError(res);

					return;
				}

				helper.success(res, {
					id: novel.id
				});
			});
		});
	});
});

router.post('/delete', sessionHandler, (req, res) => {
	if (!req.member.writer) {
		helper.clientError(res, errorCode.writerNeeded);
		return;
	}

	let id;

	if (!(id = helper.checkBodyEmpty(req, res, 'id', errorCode.novelIdInvalid, true)))
		return;

	Novel.findOne({ id: id }, (err, novel) => {
		if (err) {
			console.error(err);
			helper.serverError(res);

			return;
		}

		if (!novel) {
			helper.clientError(res, errorCode.novelIdInvalid);
			return;
		}

		if (novel.author !== req.member.nickname) {
			helper.clientError(res, errorCode.novelNotPermitted);
			return;
		}

		novel.remove(err => {
			if (err) {
				console.error(err);
				helper.serverError(res);

				return;
			}

			helper.success(res);
		});
	});
});

router.post('/post', sessionHandler, (req, res) => {
	if (!req.member.writer) {
		helper.clientError(res, errorCode.writerNeeded);
		return;
	}

	let id;
	let name;
	let content;

	if (!(id = helper.checkBodyEmpty(req, res, 'id', errorCode.novelIdInvalid, true)))
		return;

	if (!(name = req.body.name))
		name = '';

	if (!(content = req.body.content))
		content = '';

	Novel.findOne({ id: id }, (err, novel) => {
		if (err) {
			console.error(err);
			helper.serverError(res);

			return;
		}

		if (!novel) {
			helper.clientError(res, errorCode.novelIdInvalid);
			return;
		}

		if (novel.author !== req.member.nickname) {
			helper.clientError(res, errorCode.novelNotPermitted);
			return;
		}

		const episode           = new Episode();
		      episode.id        = novel.episodeCount++;
		      episode.novel     = novel.id;
		      episode.name      = name;
		      episode.content   = content;
		      novel.updatedDate = episode.createdDate = episode.updatedDate = Date.now();
		episode.save(err => {
			if (err) {
				console.error(err);
				helper.serverError(res);

				return;
			}
			
			novel.save(err => {
				if (err) {
					console.error(err);
					helper.serverError(res);

					return;
				}

				helper.success(res, {
					id: episode.id
				});
			});
		});
	});
});

module.exports = router;