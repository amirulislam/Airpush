'use strict';

var _SocketManger = require('../services/SocketManger');

var _SocketManger2 = _interopRequireDefault(_SocketManger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cluster = require('cluster');
var os = require('os');


if (cluster.isMaster) {
	// we create a HTTP server, but we do not use listen
	// that way, we have a socket.io server that doesn't accept connections
	var server = require('http').createServer();
	var io = require('socket.io').listen(server);
	var redis = require('socket.io-redis');

	io.adapter(redis({ host: 'localhost', port: 6379 }));

	for (var i = 0; i < os.cpus().length; i++) {
		cluster.fork();
	}

	cluster.on('exit', function (worker, code, signal) {
		console.log('worker ' + worker.process.pid + ' died');
	});
}

if (cluster.isWorker) {
	var app = require('../app');
	var _io = void 0;
	var _redis = void 0;
	if (process.env.NODE_ENV === 'production') {
		_io = require('socket.io').listen(app);
		_redis = require('socket.io-redis');
		_io.adapter(_redis({ host: 'localhost', port: 6379 }));
		new _SocketManger2.default(_io);
	} else {
		var server = require('http').createServer(app);
		_io = require('socket.io').listen(server);
		_redis = require('socket.io-redis');
		_io.adapter(_redis({ host: 'localhost', port: 6379 }));
		new _SocketManger2.default(_io);
		server.listen(80);
	}
}