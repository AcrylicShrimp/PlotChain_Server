
'use strict';

const mongoose = require('mongoose');

const Counter = mongoose.model('counter', mongoose.Schema({
	id : String,
	seq: Number
}));

Counter.nextSeq = function(id, callback) {
	Counter.findOne({ id: id }, (err, count) => {
		if (err) {
			callback(err, null);
			return;
		}

		if (!count)
			callback(new ReferenceError(), null);

		++count.seq;
		count.save(err => {
			if (err) {
				callback(err, null);
				return;
			}

			callback(null, count.seq - 1);
		});
	});
};

module.exports = Counter;