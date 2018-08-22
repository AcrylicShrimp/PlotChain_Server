
'use strict';

const bodyParser   = require('body-parser');
const compression  = require('compression');
const express      = require('express');
const serveFavicon = require('serve-favicon');
const helmet       = require('helmet');

const application = express();

application.use(helmet());
application.use(compression());
application.use(serveFavicon(`${__dirname}/../client/img/favicon.ico`));
application.use(bodyParser.json());
application.use(bodyParser.urlencoded({
	extended: true
}));

const heart         = require('./web/route/heart');
const member        = require('./web/route/member');
const novel         = require('./web/route/novel');
const webStatic     = require('./web/web-static');
const fallback404   = require('./fallback/notfound-fallback');
const fallbackError = require('./fallback/error-fallback');

application.use('/heart', heart);
application.use('/member', member);
application.use('/novel', novel);
application.use(webStatic);
application.use(fallback404);
application.use(fallbackError);

module.exports = application;