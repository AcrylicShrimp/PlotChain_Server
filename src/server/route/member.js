
'use strict';

const express = require('express');
const router  = express.Router();

router.get('/profile', (req, res) => {
	res.status(200).send({result: true});
});

module.exports = router;