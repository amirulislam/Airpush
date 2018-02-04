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

var _HtmlValidator = require('../utils/HtmlValidator');

var _HtmlValidator2 = _interopRequireDefault(_HtmlValidator);

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
                var joinedRoomId = socket.handshake.query.joinedRoomId;
                if (joinedRoomId != 'false' && !_lodash2.default.isNil(joinedRoomId) && String(joinedRoomId).length < 30) {
                    console.log('CONNECTED & JOINED ROOM: ', joinedRoomId);
                    socket.join(joinedRoomId);
                    socket.room = {
                        isCreator: false,
                        roomId: joinedRoomId
                        // emit to self
                    };socket.emit(_config.SOCKET_EVENTS.JOINED_ROOM, { roomId: joinedRoomId });
                    // emit to others
                    socket.broadcast.to(joinedRoomId).emit(_config.SOCKET_EVENTS.MESSAGE, {
                        type: _config.SOCKET_MESSAGE_TYPES.NEW_USER_JOINED,
                        payload: Object.assign({ type: _config.SOCKET_MESSAGE_TYPES.NEW_USER_JOINED }, socket.user)
                    });
                }
                return next();
            });
            this._io.on('connection', function (socket) {
                console.log('ON CONNECTION ', socket.user);

                // console.log('CLIENTS  ', this._io.sockets.clients());

                _this.handleLeaveRoom(socket);
                _this.handleCreateRoom(socket);
                _this.handleJoinRoom(socket);
                _this.handleMessages(socket);
                _this.handleDisconnect(socket);
            });
        }

        // handle create room

    }, {
        key: 'handleCreateRoom',
        value: function handleCreateRoom(socket) {
            socket.on(_config.SOCKET_EVENTS.CREATE_ROOM, function (data) {
                var roomId = String(_shortid2.default.generate());
                console.log('CREATE ROOM', data, 'room id', roomId);

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
                if (!_lodash2.default.isNil((0, _undefsafe2.default)(socket, 'room.roomId'))) {
                    // send leave message
                    // debug('USER LEAVE MESSSAGE');
                    socket.broadcast.to(socket.room.roomId).emit(_config.SOCKET_EVENTS.MESSAGE, {
                        type: _config.SOCKET_MESSAGE_TYPES.USER_LEAVED,
                        payload: Object.assign({ type: _config.SOCKET_MESSAGE_TYPES.USER_LEAVED }, socket.user)
                    });
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
                        payload: Object.assign({ type: _config.SOCKET_MESSAGE_TYPES.NEW_USER_JOINED }, socket.user)
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
                if (!_lodash2.default.isNil((0, _undefsafe2.default)(socket, 'room.roomId'))) {
                    socket.broadcast.to(socket.room.roomId).emit(_config.SOCKET_EVENTS.MESSAGE, {
                        type: _config.SOCKET_MESSAGE_TYPES.USER_LEAVED,
                        payload: Object.assign({ type: _config.SOCKET_MESSAGE_TYPES.USER_LEAVED }, socket.user)
                    });
                    try {
                        socket.leave(socket.room.roomId);
                    } catch (e) {};
                }
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
                        payload: Object.assign({ type: _config.SOCKET_MESSAGE_TYPES.USER_LEAVED }, socket.user)
                    });
                    socket.leave(socket.room.roomId);
                }
            });
        }

        // handle messages

    }, {
        key: 'handleMessages',
        value: function handleMessages(socket) {
            var _this2 = this;

            socket.on(_config.SOCKET_EVENTS.MESSAGE, function (data) {
                console.log('NEW MESSAGE RECEIVED', socket.room, data);
                if (_lodash2.default.isNil((0, _undefsafe2.default)(data, 'type'))) {
                    return;
                }
                switch (data.type) {
                    case _config.SOCKET_MESSAGE_TYPES.TEXT_MESSAGE:
                        var text = _HtmlValidator2.default.removeAllTags(data.textMessage);
                        text = _HtmlValidator2.default.linkify(text);
                        text = _HtmlValidator2.default.validateMaxLength(text);
                        data.textMessage = text;
                        console.log('ROOM DTA', socket.room, data, _config.SOCKET_MESSAGE_TYPES.TEXT_MESSAGE);
                        console.log('@@@@@', _config.SOCKET_MESSAGE_TYPES.TEXT_MESSAGE);
                        // socket.broadcast.to(socket.room.roomId).emit(SOCKET_EVENTS.MESSAGE, {
                        //     type: SOCKET_MESSAGE_TYPES.TEXT_MESSAGE,
                        //     payload: data
                        // });                     
                        _this2._io.in(socket.room.roomId).emit(_config.SOCKET_EVENTS.MESSAGE, {
                            type: _config.SOCKET_MESSAGE_TYPES.TEXT_MESSAGE,
                            payload: data
                        });
                        break;
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