
'use strict';

const mongoose = require('mongoose');

const history = mongoose.Schema({
	reader  : String,
	novel   : Number,
	episode : Number,
	readDate: Date
});

module.exports = mongoose.model('history', history);