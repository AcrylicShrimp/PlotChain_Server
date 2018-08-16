
'use strict';

const express = require('express');
const router  = express.Router();

const errorCode      = require('./../error-code');
const helper         = require('./../helper');
const sessionHandler = require('./../session-handler');
const Counter        = require('./../../database/counter');
const Episode        = require('./../../database/episode');
const Novel          = require('./../../database/novel');

router.get('/', sessionHandler, (req, res) => {
	Novel.find({ episodeCount: { $gt: 0 } }, { _id: false, id: true, name: true, author: true, introduction: true, episodeCount: true, createdDate: true, updatedDate: true }).sort({ updatedDate: -1 }).limit(25).exec((err, novel) => {
		if (err) {
			console.error(err);
			helper.serverError(res);

			return;
		}

		helper.success(res, {
			novel: novel
		});
	});
});

router.post('/', sessionHandler, (req, res) => {
	let name;
	let introduction;

	if (!(name = helper.checkBodyEmpty(req, res, 'name', errorCode.novelNameInvalid, true)))
		return;

	if (!(introduction = req.body.introduction))
		introduction = '';

	Counter.nextSeq('novels', (err, seq) => {
		if (err) {
			console.error(err);
			helper.serverError(res);

			return;
		}

		const novel              = new Novel();
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

router.delete('/', sessionHandler, (req, res) => {
	let id;

	if (!(id = helper.checkBodyEmpty(req, res, 'id', errorCode.novelIdInvalid, true)))
		return;

	Novel.findOne({ id: id }, { _id: true }, (err, novel) => {
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

		Episode.remove({ novel: novel.id }, err => {
			if (err) {
				console.error(err);
				helper.serverError(res);

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
});

router.get('/:id', sessionHandler, (req, res) => {
	let id;
	
	if (!(id = helper.checkParamEmpty(req, res, 'id', errorCode.novelIdInvalid, true)))
		return;

	Novel.findOne({ id: id }, { _id: false, name: true, author: true, introduction: true, episodeCount: true, createdDate: true, updatedDate: true }, (err, novel) => {
		if (err) {
			console.error(err);
			helper.serverError(res);

			return;
		}
		
		if (!novel) {
			helper.clientError(res, errorCode.novelIdInvalid);
			return;
		}

		Episode.find({ novel: id }, { _id: false, id: true, name: true, content: true, createdDate: true, updatedDate: true }, (err, episode) => {
			if (err) {
				console.error(err);
				helper.serverError(res);

				return;
			}
			
			helper.success(res, Object.assign({
				name        : novel.name,
				author      : novel.author,
				introduction: novel.introduction,
				episodeCount: novel.episodeCount,
				createdDate : novel.createdDate,
				updatedDate : novel.updatedDate,
				episode     : episode
			}));
		});
	});
});

router.post('/:id', sessionHandler, (req, res) => {
	let id;
	let name;
	let content;

	if (!(id = helper.checkParamEmpty(req, res, 'id', errorCode.novelIdInvalid, true)))
		return;

	if (!(name = req.body.name))
		name = '';

	if (!(content = req.body.content))
		content = '';

	Novel.findOne({ id: id }, { _id: true, id: true, author: true, episodeCount: true,  updatedDate: true }, (err, novel) => {
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

router.get('/:id/:episode', sessionHandler, (req, res) => {
	let id;
	let episode;

	if (!(id = helper.checkParamEmpty(req, res, 'id', errorCode.novelIdInvalid, true)))
		return;

	if (!(episode = helper.checkParamEmpty(req, res, 'episode', errorCode.episodeInvalid, true)))
		return;

	Novel.findOne({ id: id }, { _id: false, id: true, episodeCount: true }, (err, novel) => {
		if (err) {
			console.error(err);
			helper.serverError(res);

			return;
		}

		if (!novel) {
			helper.clientError(res, errorCode.novelIdInvalid);
			return;
		}
		
		if (novel.episodeCount <= episode) {
			helper.clientError(res, errorCode.episodeInvalid);
			return;
		}

		Episode.findOne({ id: episode, novel: novel.id }, { _id: false, name: true, content: true, createdDate: true, updatedDate: true }, (err, episode) => {
			if (err) {
				console.error(err);
				helper.serverError(res);

				return;
			}
			
			if (!episode) {
				helper.clientError(res, errorCode.episodeInvalid);
				return;
			}

			helper.success(res, {
				name       : episode.name,
				content    : episode.content,
				createdDate: episode.createdDate,
				updatedDate: episode.updatedDate
			});
		});
	});
});

module.exports = router;