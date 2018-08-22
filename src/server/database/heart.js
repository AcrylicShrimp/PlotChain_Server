
'use strict';

const mongoose = require('mongoose');

const heart = mongoose.Schema({
	novel   : Number,
	nickname: String
});

module.exports = mongoose.model('heart', heart);