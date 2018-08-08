
'use strict';

const mongoose = require('mongoose');

const session = mongoose.Schema({
	session      : String,
	email        : String,
	generatedTime: Date
});

module.exports = mongoose.model('session', session);