
'use strict';

module.exports = {
	noError       : 0,
	badRequest    : 1,
	loginNeeded   : 2,
	loginExpired  : 3,
	sessionInvalid: 4,
	serverError   : 500,
	member        : {
		register: {
			nicknameAlreadyInUse: 100,
			emailAlreadyInUse   : 101,
			nicknameInvalid     : 102,
			emailInvalid        : 103,
			passwordInvalid     : 104
		},
		login: {
			loginFailure: 105
		}
	}
};