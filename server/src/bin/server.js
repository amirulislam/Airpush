var cluster = require('cluster');
var os = require('os');
import SocketManager from '../services/SocketManger';

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

	cluster.on('exit', function(worker, code, signal) {
		console.log('worker ' + worker.process.pid + ' died');
	}); 
}

if (cluster.isWorker) {
	let app = require('../app');
	let io;
	let redis;
	if (process.env.NODE_ENV === 'production') {
		io = require('socket.io').listen(app);
	    redis = require('socket.io-redis');
	    io.adapter(redis({ host: 'localhost', port: 6379 }));
	    new SocketManager(io);		
	} else {
		var server = require('http').createServer(app);
		io = require('socket.io').listen(server);
		redis = require('socket.io-redis');	
		io.adapter(redis({ host: 'localhost', port: 6379 }));
		new SocketManager(io);
		server.listen(80);
	}
}
