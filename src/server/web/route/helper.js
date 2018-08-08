
'use strict';

const errorCode = require('./error-code');

module.exports = {
	success(res, data = {}) {
		res.status(200).json(Object.assign({
			success  : true,
			errorCode: errorCode.noError
		}, data));
	},
	serverError(res) {
		res.status(500).json({
			success  : false,
			errorCode: errorCode.serverError
		});
	},
	clientError(res, errCode) {
		res.status(400).json({
			success  : false,
			errorCode: errCode
		});
	},
	checkQueryEmpty(req, res, name, errorCode, trim) {
		if (!req.query[name] || typeof req.query[name] !== 'string') {
			res.status(400).json({
				success  : false,
				errorCode: errorCode
			});
			
			return null;
		}

		let value = req.query[name];

		if (trim)
			value = value.trim();
			
		if (value.length !== 0)
			return value;

		res.status(400).json({
			success  : false,
			errorCode: errorCode
		});
			
		return null;
	},
	checkBodyEmpty(req, res, name, errorCode, trim) {
		if (!req.body[name] || typeof req.body[name] !== 'string') {
			res.status(400).json({
				success  : false,
				errorCode: errorCode
			});
			
			return null;
		}

		let value = req.body[name];

		if (trim)
			value = value.trim();

		if (value.length !== 0)
			return value;

		res.status(400).json({
			success  : false,
			errorCode: errorCode
		});

		return null;
	}
};