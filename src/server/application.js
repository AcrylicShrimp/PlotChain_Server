
'use strict';

const express     = require('express');
const passport    = require('passport');
const bodyParser  = require('body-parser');
const compression = require('compression');

const application = express();

application.use(compression());
application.use(bodyParser.json());

application.use(passport.initialize());
application.use(passport.session());

const webStatic     = require('./web-static');
const fallback404   = require('./notfound-fallback');
const fallbackError = require('./error-fallback');

//application.use();
application.use(webStatic);
application.use(fallback404);
application.use(fallbackError);

module.exports = application;