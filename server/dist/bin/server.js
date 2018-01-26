'use strict';

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _cluster = require('cluster');

var _cluster2 = _interopRequireDefault(_cluster);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug2.default)('loop:server');
var numCPUs = _os2.default.cpus().length;

/**
 * Event listener for HTTP server "error" event.
 */

var onError = function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
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
};

if (_cluster2.default.isMaster) {
    debug('Master ' + process.pid + ' is running');

    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        _cluster2.default.fork();
    }

    _cluster2.default.on('exit', function (worker, code, signal) {
        debug('worker ' + worker.process.pid + ' died');
    });
} else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    // TBD - change port and HTTPS on productioon
    var server = _http2.default.createServer(_app2.default).listen(3000);
    server.on('error', onError);
    //server.on('listening', onListening);
    debug('Worker ' + process.pid + ' started');
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