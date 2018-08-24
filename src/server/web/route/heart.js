
'use strict';

const express = require('express');
const router  = express.Router();

const errorCode      = require('./../error-code');
const helper         = require('./../helper');
const sessionHandler = require('./../session-handler');
const transaction    = require('./../transaction');
const Counter        = require('./../../database/counter');
const Heart          = require('./../../database/heart');
const HeartEvent     = require('./../../database/heart-event');
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

						const heartEvent        = new HeartEvent();
						      heartEvent.novel  = id;
						      heartEvent.heart  = novel.heart;
						      heartEvent.amount = 1;
						      heartEvent.time   = Date.now();
						heartEvent.save(err => {
							if (err) {
								console.error(err);
								helper.serverError(res);

								return;
							}

							transaction(id, novel.heart);
							
							helper.success(res);
						});
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

						const heartEvent        = new HeartEvent();
						      heartEvent.novel  = id;
						      heartEvent.heart  = novel.heart;
						      heartEvent.amount = -1;
						      heartEvent.time   = Date.now();
						heartEvent.save(err => {
							if (err) {
								console.error(err);
								helper.serverError(res);

								return;
							}

							transaction(id, novel.heart);

							helper.success(res);
						});
					});
				});
			});
		});
	});
});

router.get('/history', sessionHandler, (req, res) => {
	Novel.find({ author: req.member.nickname, episodeCount: { $gt: 0 } }, { _id: false, id: true, heart: true }, (err, novel) => {
		if (err) {
			console.error(err);
			helper.serverError(res);
			
			return;
		}

		const list = [];
		const now  = Date.now();
		
		for (let minute = 14; minute >= 0; --minute)
			for (let seconds = 50; seconds >= 0; seconds -= 10)
				list.push({
					time : now - minute * 60 * 1000 - seconds * 1000,
					heart: 0
				});

		function updateListWithNovelAt(index) {
			if (index === novel.length) {
				helper.success(res, {
					history: list
				});
				return;
			}
			
			HeartEvent.find({ novel: novel[index].id, time: { $gt: now - 60 * 15 * 1000 } }, { _id: false, heart: true, amount: true, time: true }).sort({ time: 1 }).exec((err, heartEvent) => {
				if (err) {
					console.error(err);
					helper.serverError(res);
		
					return;
				}
				
				if (!heartEvent.length)
					heartEvent.push({
						time  : now,
						heart : novel[index].heart,
						amount: 0
					});
					
				heartEvent.unshift({
					time : now - 60 * 15 * 1000,
					heart: heartEvent[0].heart - heartEvent[0].amount
				});
				
				let listIndex  = 0;
				let innerIndex = 0;

				for (let minute = 14; minute >= 0; --minute)
					for (let seconds = 50; seconds >= 0; seconds -= 10) {
						const current = now - minute * 60 * 1000 - seconds * 1000;
						
						while (innerIndex + 1 < heartEvent.length && heartEvent[innerIndex + 1].time <= current)
							++innerIndex;

						list[listIndex++].heart += heartEvent[innerIndex].heart;
					}

				updateListWithNovelAt(index + 1);
			});
		}
		
		updateListWithNovelAt(0);
	});
});

module.exports = router;