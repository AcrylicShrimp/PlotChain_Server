
'use strict';

const express     = require('express');
const passport    = require('passport');
const bodyParser  = require('body-parser');
const compression = require('compression');

const application = express();

application.use(compression());
application.use(bodyParser.json());
application.use(bodyParser.urlencoded({
	extended: true
}));

application.use(passport.initialize());
application.use(passport.session());

const member        = require('./web/route/member');
const webStatic     = require('./web/web-static');
const fallback404   = require('./fallback/notfound-fallback');
const fallbackError = require('./fallback/error-fallback');

application.use('/member', member);
application.use(webStatic);
application.use(fallback404);
application.use(fallbackError);

module.exports = application;