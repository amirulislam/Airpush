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

var _config = require('../config');

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

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
            var _this = this;

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

                // console.log('CLIENTS  ', this._io.sockets.clients());

                _this.handleLeaveRoom(socket);
                _this.handleCreateRoom(socket);
                _this.handleJoinRoom(socket);
                _this.handleDisconnect(socket);
            });
        }

        // handle create room

    }, {
        key: 'handleCreateRoom',
        value: function handleCreateRoom(socket) {
            socket.on(_config.SOCKET_EVENTS.CREATE_ROOM, function (data) {
                console.log('CREATE ROOM', data, 'SOket', socket.id);

                var roomId = String(_shortid2.default.generate());
                socket.room = {
                    isCreator: true,
                    roomId: roomId
                };
                socket.join(roomId);
                socket.emit(_config.SOCKET_EVENTS.ROOM_CREATED, { roomId: roomId });
            });
        }

        // handle join room

    }, {
        key: 'handleJoinRoom',
        value: function handleJoinRoom(socket) {
            socket.on(_config.SOCKET_EVENTS.JOIN_ROOM, function (data) {
                console.log(_config.SOCKET_EVENTS.JOIN_ROOM, data, 'SOket', socket.id);
                console.log(socket.room);
                if (!_lodash2.default.isNil((0, _undefsafe2.default)(socket, 'room.roomId'))) {
                    // send leave message
                    socket.leave(socket.room.roomId);
                }
                var roomToJoin = data.roomToJoin;

                if (_lodash2.default.isString(roomToJoin) && String(roomToJoin).length < 20) {
                    socket.room = {
                        isCreator: false,
                        roomId: roomToJoin
                    };
                    socket.join(roomToJoin);
                    // emit to self
                    socket.emit(_config.SOCKET_EVENTS.JOINED_ROOM, { roomId: roomToJoin });
                    // emit to others
                    socket.broadcast.to(roomToJoin).emit(_config.SOCKET_EVENTS.MESSAGE, {
                        type: _config.SOCKET_MESSAGE_TYPES.NEW_USER_JOINED,
                        user: socket.user
                    });
                }
            });
        }

        // handle disconnect

    }, {
        key: 'handleDisconnect',
        value: function handleDisconnect(socket) {
            socket.on(_config.SOCKET_EVENTS.DISCONNECT, function (s) {
                // inform others in the room
                console.log('SOcket server disconnect');
            });
        }
    }, {
        key: 'handleLeaveRoom',
        value: function handleLeaveRoom(socket) {
            socket.on(_config.SOCKET_EVENTS.LEAVE_ROOM, function (data) {
                // inform others
                if (!_lodash2.default.isNil((0, _undefsafe2.default)(socket, 'room.roomId'))) {
                    socket.broadcast.to(socket.room.roomId).emit(_config.SOCKET_EVENTS.MESSAGE, {
                        type: _config.SOCKET_MESSAGE_TYPES.USER_LEAVED,
                        user: socket.user
                    });
                    socket.leave(socket.room.roomId);
                }
            });
        }

        // validate auth

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