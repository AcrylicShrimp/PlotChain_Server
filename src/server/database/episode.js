
'use strict';

const mongoose = require('mongoose');

const episode = mongoose.Schema({
	id         : String,
	novel      : String,
	name       : String,
	content    : String,
	createdDate: Date,
	updatedDate: Date
});

module.exports = mongoose.model('episode', episode);