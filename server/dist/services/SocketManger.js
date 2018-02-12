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
                socket.user.socketId = socket.id;
                return next();
            });
            this._io.use(function (socket, next) {
                // implement existing socket ERROR
                return next();
            });
            this._io.on('connection', function (socket) {
                // console.log('ON CONNECTION ', socket.user);
                _this.handleJoinRoomEvent(socket);
                _this.handleLeaveRoom(socket);
                _this.handleCreateRoom(socket);
                _this.handleJoinRoom(socket);
                _this.handleMessages(socket);
                _this.handleDisconnect(socket);
            });
        }
    }, {
        key: 'handleJoinRoomEvent',
        value: function handleJoinRoomEvent(socket) {
            var joinedRoomId = socket.handshake.query.joinedRoomId;
            if (joinedRoomId != 'false' && !_lodash2.default.isNil(joinedRoomId) && String(joinedRoomId).length < 30) {
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
        }

        // handle create room

    }, {
        key: 'handleCreateRoom',
        value: function handleCreateRoom(socket) {
            socket.on(_config.SOCKET_EVENTS.CREATE_ROOM, function (data) {
                var roomId = String(_shortid2.default.generate());
                // console.log('CREATE ROOM', data, 'room id', roomId);

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
                var roomToJoin = data.roomToJoin;


                if (!_lodash2.default.isNil((0, _undefsafe2.default)(socket, 'room.roomId')) && roomToJoin != socket.room.roomId) {
                    socket.broadcast.to(socket.room.roomId).emit(_config.SOCKET_EVENTS.MESSAGE, {
                        type: _config.SOCKET_MESSAGE_TYPES.USER_LEAVED,
                        payload: Object.assign({ type: _config.SOCKET_MESSAGE_TYPES.USER_LEAVED }, socket.user)
                    });
                    socket.leave(socket.room.roomId);
                }

                var isAlreadyConnectedToRoom = !_lodash2.default.isNil((0, _undefsafe2.default)(socket, 'room.roomId')) && roomToJoin == socket.room.roomId;
                if (!isAlreadyConnectedToRoom && _lodash2.default.isString(roomToJoin) && String(roomToJoin).length < 20) {
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
                } else {
                    // // emit to self
                    // socket.emit(SOCKET_EVENTS.JOINED_ROOM, { roomId: socket.room.roomId });
                    // // emit to others
                    // socket.broadcast.to(roomToJoin).emit(SOCKET_EVENTS.MESSAGE, {
                    //     type: SOCKET_MESSAGE_TYPES.NEW_USER_JOINED,
                    //     payload: Object.assign({type: SOCKET_MESSAGE_TYPES.NEW_USER_JOINED}, socket.user)
                    // });                
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
                        // socket.leave(socket.room.roomId);
                    } catch (e) {};
                }
            });
        }
    }, {
        key: 'handleLeaveRoom',
        value: function handleLeaveRoom(socket) {
            socket.on(_config.SOCKET_EVENTS.LEAVE_ROOM, function (data) {
                // inform others
                // console.log(SOCKET_EVENTS.LEAVE_ROOM, socket.user);
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
                // console.log('NEW MESSAGE RECEIVED', socket.room);
                if (_lodash2.default.isNil((0, _undefsafe2.default)(data, 'type'))) {
                    return;
                }
                switch (data.type) {
                    case _config.SOCKET_MESSAGE_TYPES.TEXT_MESSAGE:
                        var text = _HtmlValidator2.default.removeAllTags(data.textMessage);
                        text = _HtmlValidator2.default.linkify(text);
                        text = _HtmlValidator2.default.validateMaxLength(text);
                        data.textMessage = text;
                        if (!_lodash2.default.isNil((0, _undefsafe2.default)(socket, 'room.roomId'))) {
                            _this2._io.in(socket.room.roomId).emit(_config.SOCKET_EVENTS.MESSAGE, {
                                type: _config.SOCKET_MESSAGE_TYPES.TEXT_MESSAGE,
                                payload: data
                            });
                        } else {
                            console.log('ERROR >>>> NO ROOM >>>>');
                        }
                        break;
                    // case SOCKET_MESSAGE_TYPES.ACCEPT_FILE_MESSAGE:
                    //     // console.log(SOCKET_MESSAGE_TYPES.ACCEPT_FILE_MESSAGE, data);
                    //     if (!_.isNil(safe(socket, 'room.roomId'))) {      
                    //         data.user = socket.user;
                    //         socket.broadcast.to(socket.room.roomId).emit(SOCKET_EVENTS.MESSAGE, {
                    //             type: data.type,
                    //             payload: data
                    //         });
                    //     }
                    // break;                
                    // case SOCKET_MESSAGE_TYPES.USER_DISCOVER_SIGNAL:
                    //     if (!_.isNil(safe(data, 'peerData.sender')) && !_.isNil(safe(data, 'peerData.sendTo'))) {
                    //         data.peerData.sender.socketId = socket.user.socketId;
                    //         socket.to(data.peerData.sendTo).emit(SOCKET_EVENTS.MESSAGE, {
                    //                 type: SOCKET_MESSAGE_TYPES.USER_DISCOVER_SIGNAL,
                    //                 payload: data.peerData.sender
                    //             }
                    //         );
                    //     }
                    // break;                
                    case _config.SOCKET_MESSAGE_TYPES.PEER_SIGNAL:
                        if (!_lodash2.default.isNil((0, _undefsafe2.default)(data, 'peerData.toUser.socketId'))) {
                            var sendToSocketId = data.peerData.toUser.socketId;
                            data.peerData.fromUser = socket.user;
                            delete data.peerData.toUser;
                            socket.to(sendToSocketId).emit(_config.SOCKET_EVENTS.MESSAGE, {
                                type: _config.SOCKET_MESSAGE_TYPES.PEER_SIGNAL,
                                payload: data.peerData
                            });
                        }
                        break;
                    case _config.SOCKET_MESSAGE_TYPES.PEER_SIGNAL_ANSWER:
                        console.log('RECEIVED PEER_SIGNAL_ANSWER', data);
                        if (!_lodash2.default.isNil((0, _undefsafe2.default)(data, 'peerData.fromUser.socketId'))) {
                            var _sendToSocketId = data.peerData.fromUser.socketId;
                            data.peerData.fromUser = socket.user;
                            socket.to(_sendToSocketId).emit(_config.SOCKET_EVENTS.MESSAGE, {
                                type: _config.SOCKET_MESSAGE_TYPES.PEER_SIGNAL_ANSWER,
                                payload: data.peerData
                            });
                        }
                        break;
                    case _config.SOCKET_MESSAGE_TYPES.PEER_SIGNAL_ICE:
                        // console.log('RECEIVED PEER_SIGNAL_ICE', data);
                        if (!_lodash2.default.isNil((0, _undefsafe2.default)(data, 'peerData.user.socketId'))) {
                            var _sendToSocketId2 = data.peerData.user.socketId;
                            data.peerData.user = socket.user;
                            socket.to(_sendToSocketId2).emit(_config.SOCKET_EVENTS.MESSAGE, {
                                type: _config.SOCKET_MESSAGE_TYPES.PEER_SIGNAL_ICE,
                                payload: data.peerData
                            });
                        }
                        break;
                    // case SOCKET_MESSAGE_TYPES.PEER_SIGNAL_IM_READY:
                    //     // console.log(SOCKET_MESSAGE_TYPES.PEER_SIGNAL_IM_READY, data);
                    //     if (!_.isNil(safe(data, 'peerData.user.socketId'))) {
                    //         const sendToSocketId = data.peerData.user.socketId;
                    //         data.peerData.user = socket.user;
                    //         socket.to(sendToSocketId).emit(SOCKET_EVENTS.MESSAGE, {
                    //                 type: SOCKET_MESSAGE_TYPES.PEER_SIGNAL_IM_READY,
                    //                 payload: data.peerData
                    //             }
                    //         );
                    //     }               
                    // break;                                                
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