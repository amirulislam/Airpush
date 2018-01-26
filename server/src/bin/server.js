import app from '../app';
import dbg from 'debug';
import http from 'http';
import os from 'os';
import cluster from 'cluster';
import debugPck from 'debug';

const debug = debugPck('loop:server');
const numCPUs = os.cpus().length;


/**
 * Event listener for HTTP server "error" event.
 */

const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
    case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
    default:
        throw error;
  }
}

if (cluster.isMaster) {
    debug(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
      debug(`worker ${worker.process.pid} died`);
  });
} else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    // TBD - change port and HTTPS on productioon
    let server = http.createServer(app).listen(3000);
    server.on('error', onError);
    //server.on('listening', onListening);
    debug(`Worker ${process.pid} started`);
}


/**
 * Event listener for HTTP server "listening" event.
 */

// const onListening = () => {
//   var addr = server.address();
//   var bind = typeof addr === 'string'
//     ? 'pipe ' + addr
//     : 'port ' + addr.port;
//   debug('Listening on ' + bind);
// }
