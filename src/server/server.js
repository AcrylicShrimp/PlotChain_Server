
'use strict';

const http = require('http');

const application = require('./application');
const httpServer  = http.createServer(application);
//const httpsServer;

const httpPort = process.env.HTTP_PORT || 80;
//const httpsPort = process.env.HTTPS_PORT || 443;

httpServer.listen(httpPort, () => {
	console.log(`HTTP server is running on port ${httpPort}.`);
});