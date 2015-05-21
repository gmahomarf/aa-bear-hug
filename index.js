'use strict';

var Hapi = require('hapi');

var serverConfig = require('./config/server-config');
var facebookHandler = require('./util/facebook-handler');

var server = new Hapi.Server({
	debug: {
		log: ['error'],
		request: ['error']
	}
});

server.connection(serverConfig);
server.views({
	engines: {
		html: require('handlebars')
	},
	path: __dirname + '/templates'
});

server.route([
	{
		method: '*',
		path: '/',
		handler: facebookHandler.checkLoginStatus
	}
]);

server.ext('onPreResponse', function(request, reply) {

	var response = request.response;
	if (response.isBoom) {
		console.error(response.stack);
	}

	return reply.continue();
});

server.start(function(err) {
	if (err) {
		console.error('Failed to start server:', err);
		process.exit(1);
	}

	console.log('Server started and listening at:', server.info.uri);
});
