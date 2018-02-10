// https://stackoverflow.com/questions/18310635/scaling-socket-io-to-multiple-node-js-processes-using-cluster/18650183#18650183
// https://stackoverflow.com/questions/33656128/node-js-socket-io-scaling-with-redis-cluster
// https://medium.com/@petehouston/install-and-config-redis-on-mac-os-x-via-homebrew-eb8df9a4f298
// http://www.html5gamedevs.com/topic/12321-create-a-cluster-server-with-nodejs-and-socketio/

//var io = require('socket.io')(3000);
//var redis = require('socket.io-redis');
//io.adapter(redis({ host: 'localhost', port: 6379 }));

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

//   setInterval(function() {
//     // all workers will receive this in Redis, and emit
//     console.log('EMIT NOW');
//     io.emit('data', 'payload');
//   }, 2000);

	for (var i = 0; i < os.cpus().length; i++) {
		cluster.fork();
	}

	cluster.on('exit', function(worker, code, signal) {
		console.log('worker ' + worker.process.pid + ' died');
	}); 
}

if (cluster.isWorker) {
	if (process.env.NODE_ENV === 'production') {

		// var httpServer = require('../app');
		// var server = http.createServer(app);
		// var io = require('socket.io').listen(httpServer);
		// var redis = require('socket.io-redis');
		// io.adapter(redis({ host: 'localhost', port: 6379 }));
		// new SocketManager(io);


	    var app = require('../app');
	    //var server = http.createServer(app);
	    var io = require('socket.io').listen(app);
	    var redis = require('socket.io-redis');
	    io.adapter(redis({ host: 'localhost', port: 6379 }));
	    new SocketManager(io);		
		
		
		// var httpServer = require('../app');
		// var server = require('http').createServer(app);
		// var io = require('socket.io').listen(server);
		// var redis = require('socket.io-redis');
	
		// io.adapter(redis({ host: 'localhost', port: 6379 }));
	
		// new SocketManager(io);
	
		// server.listen(80);
	} else {
		var app = require('../app');
	
	
		// var httpServer = require('../app');
		var server = require('http').createServer(app);
		var io = require('socket.io').listen(server);
		var redis = require('socket.io-redis');
	
		io.adapter(redis({ host: 'localhost', port: 6379 }));
	
		new SocketManager(io);
	
		server.listen(80);
	}
}


///// END 

// import app from '../app';
// import dbg from 'debug';
// import http from 'http';
// import os from 'os';
// import cluster from 'cluster';
// import debugPck from 'debug';
// // import sticky from 'sticky-session';

// const debug = debugPck('airpush:server');
// const numCPUs = os.cpus().length;




// /**
//  * Event listener for HTTP server "error" event.
//  */

// const onError = (error) => {
//   if (error.syscall !== 'listen') {
//     throw error;
//   }
//   var bind = typeof port === 'string'
//     ? 'Pipe ' + port
//     : 'Port ' + port;
//   // handle specific listen errors with friendly messages
//   switch (error.code) {
//     case 'EACCES':
//         console.error(bind + ' requires elevated privileges');
//         process.exit(1);
//         break;
//     case 'EADDRINUSE':
//         console.error(bind + ' is already in use');
//         process.exit(1);
//         break;
//     default:
//         throw error;
//   }
// }

// if (cluster.isMaster) {
//     debug(`Master ${process.pid} is running`);

//   // Fork workers.
//   for (let i = 0; i < numCPUs; i++) {
//       cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//       debug(`worker ${worker.process.pid} died`);
//   });
// } else {
//     // Workers can share any TCP connection
//     // In this case it is an HTTP server
//     // TBD - change port and HTTPS on productioon
//     let server = http.createServer(app).listen(3000);
//     server.on('error', onError);
//     //server.on('listening', onListening);
//     debug(`Worker ${process.pid} started`);
// }


// /**
//  * Event listener for HTTP server "listening" event.
//  */

// // const onListening = () => {
// //   var addr = server.address();
// //   var bind = typeof addr === 'string'
// //     ? 'pipe ' + addr
// //     : 'port ' + addr.port;
// //   debug('Listening on ' + bind);
// // }
