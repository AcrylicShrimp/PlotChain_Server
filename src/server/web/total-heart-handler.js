
'use strict';

const helper  = require('./helper');
const Counter = require('./../database/counter');

module.exports = (req, res, next) => {
	Counter.findOne({ id: 'hearts' }, { _id: false, seq: true }, (err, counter) => {
		if (err) {
			console.error(err);
			helper.serverError(res);

			return;
		}
		
		if (!counter) {
			console.error(err);
			helper.serverError(res);

			return;
		}

		req.totalHeart = counter.seq;

		next();
	});
};