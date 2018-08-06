
'use strict';

const express     = require('express');
const passport    = require('passport');
const bodyParser  = require('body-parser');
const compression = require('compression');

const application = express();

application.use((req, res, next) => {
	if (!req.is('application/json')) {
		res.status(400).end();
		return;
	}

	next();
});

application.use(compression());
application.use(bodyParser.json());

application.use(passport.initialize());
application.use(passport.session());

application.use();

application.use((err, req, res) => {
	res.status(400).end();
});

exports = application;