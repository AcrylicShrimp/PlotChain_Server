
'use strict';

const mongoose = require('mongoose');

const novel = mongoose.Schema({
	id          : Number,
	name        : String,
	author      : String,
	introduction: String,
	episodeCount: Number,
	createdDate : Date,
	updatedDate : Date
});

module.exports = mongoose.model('novel', novel);