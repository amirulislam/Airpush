/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _JWT = require('../utils/JWT');

var _JWT2 = _interopRequireDefault(_JWT);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _undefsafe = require('undefsafe');

var _undefsafe2 = _interopRequireDefault(_undefsafe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SocketManager = function () {
    function SocketManager(io) {
        _classCallCheck(this, SocketManager);

        this._io = io;
        this.handleConnection();
    }

    _createClass(SocketManager, [{
        key: 'handleConnection',
        value: function handleConnection() {
            this._io.use(function (socket, next) {
                var user = SocketManager.isValidAuth(socket.handshake.query.x__authorization);
                if (!user) {
                    return next(new Error('AUTH_ERROR'));
                }
                socket.user = user;
                return next();
            });
            this._io.on('connection', function (socket) {
                console.log('ON CONNECTION ', socket.user);
                socket.on('greet', function (data) {
                    console.log('GREET', data);
                });
                socket.on('disconnect', function (s) {
                    console.log('SOcket server disconnect');
                });
            });
        }
    }], [{
        key: 'isValidAuth',
        value: function isValidAuth(x__authorization) {
            var decoded = _JWT2.default.isValidToken(x__authorization);
            if (!_lodash2.default.isNil((0, _undefsafe2.default)(decoded, '_id'))) {
                return decoded;
            }
            return false;
        }
    }]);

    return SocketManager;
}();

exports.default = SocketManager;