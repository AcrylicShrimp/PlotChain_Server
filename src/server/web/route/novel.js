
'use strict';

const express = require('express');
const router  = express.Router();

const errorCode         = require('../error-code');
const helper            = require('./../helper');
const sessionHandler    = require('./../session-handler');
const totalHeartHandler = require('./../total-heart-handler');
const Counter           = require('./../../database/counter');
const Episode           = require('./../../database/episode');
const Heart             = require('./../../database/heart');
const HeartEvent        = require('./../../database/heart-event');
const History           = require('./../../database/history');
const Novel             = require('./../../database/novel');

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

function joinNovelsWithIsHeart(member, query, callback) {
	query.exec((err, novel) => {
		if (err) {
			callback(err, null);
			return;
		}
		
		const list = [];

		function joinNovelWithIsHeartAt(index) {
			if (index === novel.length) {
				callback(null, list);
				return;
			}

			Heart.findOne({ novel: novel[index].id, nickname: member.nickname }, { _id: true }, (err, heart) => {
				if (err) {
					callback(err, null);
					return;
				}

				novel[index].isHeart = heart ? true : false;

				list.push(novel[index]);
				
				joinNovelWithIsHeartAt(index + 1);
			});
		}

		joinNovelWithIsHeartAt(0);
	});
}

router.get('/', sessionHandler, totalHeartHandler, (req, res) => {
	let mode;
	let position;

	if (!(mode = helper.checkQueryEmpty(req, res, 'mode', errorCode.modeInvalid, true)))
		return;

	if (Number.isNaN(mode = Number(mode))) {
		helper.clientError(res, errorCode.modeInvalid);
		return;
	}
		
	if (!(position = Number(req.query.position)))
		position = 0;
		
	if (mode)
		joinNovelsWithIsHeart(req.member, Novel.find({ episodeCount: { $gt: 0 } }, { _id: false, id: true, name: true, color: true, author: true, genre: true, state: true, heart: true, introduction: true, episodeCount: true, createdDate: true, updatedDate: true }).sort({ updatedDate: -1 }).skip(position).limit(25), (err, novel) => {
			if (err) {
				console.error(err);
				helper.serverError(res);

				return;
			}

			helper.success(res, {
				totalHeart: req.totalHeart,
				novel     : novel.map(novel => {
					return {
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
						updatedDate : novel.updatedDate,
					};
				})
			});
		});
	else
		joinNovelsWithIsHeart(req.member, Novel.find({ episodeCount: { $gt: 0 } }, { _id: false, id: true, name: true, color: true, author: true, genre: true, state: true, heart: true, introduction: true, episodeCount: true, createdDate: true, updatedDate: true }).sort({ heart: -1 }).skip(position).limit(25), (err, novel) => {
			if (err) {
				console.error(err);
				helper.serverError(res);

				return;
			}

			helper.success(res, {
				totalHeart: req.totalHeart,
				novel     : novel.map(novel => {
					return {
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
						updatedDate : novel.updatedDate,
					};
				})
			});
		});
});

router.get('/list', sessionHandler, totalHeartHandler, (req, res) => {
	let nickname;

	if (!(nickname = helper.checkQueryEmpty(req, res, 'nickname', errorCode.nicknameInvalid, true)))
		return;

	joinNovelsWithIsHeart(req.member, Novel.find({ author: nickname }, { _id: false, id: true, name: true, color: true, genre: true, state: true, heart: true, introduction: true, episodeCount: true, createdDate: true, updatedDate: true }), (err, novel) => {
		if (err) {
			console.error(err);
			helper.serverError(res);

			return;
		}

		helper.success(res, {
			totalHeart: req.totalHeart,
			novel     : novel.map(novel => {
				return {
					isHeart     : novel.isHeart,
					id          : novel.id,
					name        : novel.name,
					color       : novel.color,
					genre       : novel.genre,
					state       : novel.state,
					heart       : novel.heart,
					introduction: novel.introduction,
					episodeCount: novel.episodeCount,
					createdDate : novel.createdDate,
					updatedDate : novel.updatedDate,
				};
			})
		});
	});
});

router.post('/', sessionHandler, (req, res) => {
	let name;
	let color;
	let genre;
	let introduction;

	if (!(name = helper.checkBodyEmpty(req, res, 'name', errorCode.novelNameInvalid, true)))
		return;

	if (!(color = helper.checkBodyEmpty(req, res, 'color', errorCode.colorInvalid, true)))
		return;

	if (!/^#(?:[0-9]|[a-f]|[A-F]){6}$/.test(color)) {
		helper.clientError(res, errorCode.colorInvalid);
		return;
	}
	
	if (!Number.isInteger(genre = req.body.genre)) {
		helper.clientError(res, errorCode.genreInvalid);
		return;
	}
	
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
		      novel.color        = color;
		      novel.author       = req.member.nickname;
		      novel.genre        = genre;
		      novel.state        = 0;
		      novel.heart        = 0;
		      novel.introduction = introduction;
		      novel.episodeCount = 0;
		      novel.createdDate  = novel.updatedDate = Date.now();
		novel.save(err => {
			if (err) {
				console.error(err);
				helper.serverError(res);

				return;
			}

			const heartEvent        = new HeartEvent();
			      heartEvent.novel  = seq;
			      heartEvent.heart  = 0;
			      heartEvent.amount = 0;
			      heartEvent.time   = novel.createdDate;
			heartEvent.save(err => {
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

router.delete('/', sessionHandler, (req, res) => {
	let id;

	if (!(id = helper.checkBodyEmpty(req, res, 'id', errorCode.novelIdInvalid, true)))
		return;

	if (Number.isNaN(id = Number(id))) {
		helper.clientError(res, errorCode.novelIdInvalid);
		return;
	}

	Novel.findOne({ id: id }, { _id: true, heart: true }, (err, novel) => {
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

		Episode.remove({ novel: id }, err => {
			if (err) {
				console.error(err);
				helper.serverError(res);

				return;
			}

			History.remove({ novel: id }, err => {
				if (err) {
					console.error(err);
					helper.serverError(res);

					return;
				}

				Heart.remove({ novel: id }, err => {
					if (err) {
						console.error(err);
						helper.serverError(res);

						return;
					}

					Counter.reduceSeq('hearts', novel.heart, (err, seq) => {
						if (err) {
							console.error(err);
							helper.serverError(res);

							return;
						}

						HeartEvent.remove({ novel: id }, err => {
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
			});
		});
	});
});

router.get('/:id', sessionHandler, totalHeartHandler, (req, res) => {
	let id;
	
	if (!(id = helper.checkParamEmpty(req, res, 'id', errorCode.novelIdInvalid, true)))
		return;

	if (Number.isNaN(id = Number(id))) {
		helper.clientError(res, errorCode.novelIdInvalid);
		return;
	}

	joinNovelWithIsHeart(req.member, Novel.findOne({ id: id }, { _id: false, id: id, name: true, color: true, author: true, genre: true, state: true, heart: true, introduction: true, episodeCount: true, createdDate: true, updatedDate: true }), (err, novel) => {
		if (err) {
			console.error(err);
			helper.serverError(res);

			return;
		}

		if (!novel) {
			helper.clientError(res, errorCode.novelIdInvalid);
			return;
		}

		Episode.find({ novel: id }, { _id: false, id: true, name: true, createdDate: true, updatedDate: true }, (err, episode) => {
			if (err) {
				console.error(err);
				helper.serverError(res);

				return;
			}

			helper.success(res, Object.assign({
				totalHeart  : req.totalHeart,
				name        : novel.name,
				color       : novel.color,
				author      : novel.author,
				genre       : novel.genre,
				state       : novel.state,
				heart       : novel.heart,
				isHeart     : novel.isHeart,
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

	if (Number.isNaN(id = Number(id))) {
		helper.clientError(res, errorCode.novelIdInvalid);
		return;
	}

	if (!(name = req.body.name))
		name = '';

	if (!(content = req.body.content))
		content = '';

	Novel.findOne({ id: id }, { _id: true, author: true, episodeCount: true,  updatedDate: true }, (err, novel) => {
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
		      episode.novel     = id;
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
	let episodeId;

	if (!(id = helper.checkParamEmpty(req, res, 'id', errorCode.novelIdInvalid, true)))
		return;

	if (!(episodeId = helper.checkParamEmpty(req, res, 'episode', errorCode.episodeInvalid, true)))
		return;

	if (Number.isNaN(id = Number(id))) {
		helper.clientError(res, errorCode.novelIdInvalid);
		return;
	}

	if (Number.isNaN(episodeId = Number(episodeId))) {
		helper.clientError(res, errorCode.episodeInvalid);
		return;
	}

	Episode.findOne({ id: episodeId, novel: id }, { _id: false, name: true, content: true, createdDate: true, updatedDate: true }, (err, episode) => {
		if (err) {
			console.error(err);
			helper.serverError(res);

			return;
		}
		
		if (!episode) {
			helper.clientError(res, errorCode.episodeInvalid);
			return;
		}
		
		History.findOne({ reader: req.member.nickname, novel: id }, { _id: true, episode: true, readDate: true }, (err, history) => {
			if (err) {
				console.error(err);
				helper.serverError(res);

				return;
			}

			if (!history) {
				history        = new History();
				history.reader = req.member.nickname;
				history.novel  = id;
			}
			
			history.episode  = episodeId;
			history.readDate = Date.now();
			history.save(err => {
				if (err) {
					console.error(err);
					helper.serverError(res);

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
});

module.exports = router;