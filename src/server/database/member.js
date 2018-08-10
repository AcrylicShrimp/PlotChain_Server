
'use strict';

const mongoose = require('mongoose');

const member = mongoose.Schema({
	nickname: String,
	email   : String,
	password: String,
	writer  : Boolean
});

module.exports = mongoose.model('member', member);