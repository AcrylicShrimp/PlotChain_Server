
'use strict';

const http = require('http');

const application = require('./application');
const httpServer  = http.createServer(application);

const database = require('./database');
database(() => {
	console.log('Connected to the database server.');

	const httpPort = process.env.HTTP_PORT || 80;
	
	httpServer.listen(httpPort, () => {
		console.log(`HTTP server is running on port ${httpPort}.`);
	});
});