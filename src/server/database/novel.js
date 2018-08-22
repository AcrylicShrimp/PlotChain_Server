
'use strict';

const mongoose = require('mongoose');

const novel = mongoose.Schema({
	id          : Number,
	name        : String,
	color       : String,
	author      : String,
	genre       : Number,
	state       : Number,
	heart       : Number,
	introduction: String,
	episodeCount: Number,
	createdDate : Date,
	updatedDate : Date
});

module.exports = mongoose.model('novel', novel);