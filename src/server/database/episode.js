
'use strict';

const mongoose = require('mongoose');

const episode = mongoose.Schema({
	id         : Number,
	novel      : Number,
	name       : String,
	content    : String,
	createdDate: Date,
	updatedDate: Date
});

module.exports = mongoose.model('episode', episode);