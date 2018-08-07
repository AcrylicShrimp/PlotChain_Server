
'use strict';

const passport      = require('passport');
const passportLocal = require('passport-local');

const localStrategy = passportLocal.Strategy;

passport.use(new localStrategy({
	usernameField    : 'id',
	passwordField    : 'pw',
	passReqToCallback: true
}, (req, id, pw, done) => {

}));