
'use strict';

module.exports = {
	noError    : 0,
	serverError: 500,
	member     : {
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