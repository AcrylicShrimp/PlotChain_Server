
'use strict';

const mongoose = require('mongoose');

const heartEvent = mongoose.Schema({
	novel : Number,
	heart : Number,
	amount: Number,
	time  : Date
});

module.exports = mongoose.model('heartEvent', heartEvent);