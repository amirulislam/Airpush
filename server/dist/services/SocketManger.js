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

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SocketManager = function () {
    function SocketManager(io, socketUsersInstance) {
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
                socket.user.shortid = _shortid2.default.generate();
                socket.x__useHere = socket.handshake.query.x__useHere;
                return next();
            });
            this._io.use(function (socket, next) {
                return next();
            });

            this._io.on('connection', function (socket) {
                SocketManager.isUserConnected(socket.user._id, socket.id).then(function (connectedToSocketId) {
                    if (connectedToSocketId === false) {
                        SocketManager.setConnectedUser(socket.user._id, socket.id, true);
                        _this.handleSocketEvents(socket);
                    } else {
                        if (socket.x__useHere === true || socket.x__useHere === 'true') {
                            // disconnect other peer
                            // connect here
                            socket.broadcast.to(connectedToSocketId).emit(_config.SOCKET_EVENTS.MESSAGE, {
                                type: _config.SOCKET_MESSAGE_TYPES.OTHER_CLIENT_USAGE,
                                payload: {
                                    clientId: socket.id
                                }
                            });
                            SocketManager.setConnectedUser(socket.user._id, socket.id, true);
                            _this.handleSocketEvents(socket);
                        } else {
                            // disconnect and inform use here
                            socket.emit(_config.SOCKET_EVENTS.MESSAGE, {
                                type: _config.SOCKET_MESSAGE_TYPES.ALREADY_CONNECTED_ERROR,
                                payload: {
                                    message: 'Airpush is open in another window. Click "Use here" to use Airpush in this window.'
                                }
                            });
                            socket.disconnect();
                        }
                    }
                }).catch(function (err) {
                    // log error
                });
            });
        }
    }, {
        key: 'handleSocketEvents',
        value: function handleSocketEvents(socket) {
            this.handleLeaveRoom(socket);
            this.handleCreateRoom(socket);
            this.handleJoinRoom(socket);
            this.handleMessages(socket);
            this.handleDisconnect(socket);
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
            var _this2 = this;

            socket.on(_config.SOCKET_EVENTS.JOIN_ROOM, function (data) {
                var roomToJoin = data.roomToJoin;

                // leve if already belongs to another room

                if (!_lodash2.default.isNil((0, _undefsafe2.default)(socket, 'room.roomId')) && roomToJoin != socket.room.roomId) {
                    socket.broadcast.to(socket.room.roomId).emit(_config.SOCKET_EVENTS.MESSAGE, {
                        type: _config.SOCKET_MESSAGE_TYPES.USER_LEAVED,
                        payload: Object.assign({ type: _config.SOCKET_MESSAGE_TYPES.USER_LEAVED }, socket.user)
                    });
                    socket.leave(socket.room.roomId);
                }

                var isAlreadyConnectedToRoom = !_lodash2.default.isNil((0, _undefsafe2.default)(socket, 'room.roomId')) && roomToJoin == socket.room.roomId;
                if (!isAlreadyConnectedToRoom && _lodash2.default.isString(roomToJoin) && String(roomToJoin).length < 20) {
                    _this2.getExistingClientsNumber(roomToJoin).then(function (existingClientsNo) {
                        if (existingClientsNo >= _config.CHAT_ROOM_MAX_CLIENTS) {
                            socket.emit(_config.SOCKET_EVENTS.MESSAGE, {
                                type: _config.SOCKET_MESSAGE_TYPES.ROOM_FOOL_ERROR,
                                payload: {
                                    message: 'Maximum number of group chat participants has been reached. Maximum allowed users: ' + _config.CHAT_ROOM_MAX_CLIENTS + '.'
                                }
                            });
                            return;
                        }
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
                    }).catch(function (err) {});
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
            var _this3 = this;

            socket.on(_config.SOCKET_EVENTS.MESSAGE, function (data) {
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
                            _this3._io.in(socket.room.roomId).emit(_config.SOCKET_EVENTS.MESSAGE, {
                                type: _config.SOCKET_MESSAGE_TYPES.TEXT_MESSAGE,
                                payload: data
                            });
                        } else {
                            console.log('ERROR >>>> NO ROOM >>>>');
                        }
                        break;
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
                    case _config.SOCKET_MESSAGE_TYPES.SOCKET_STATE:
                        if (!_lodash2.default.isNil((0, _undefsafe2.default)(data, 'peerData.toUser.socketId'))) {
                            // console.log('RECEIVED SOCKET_STATE', data);
                            var _sendToSocketId3 = data.peerData.toUser.socketId;
                            data.peerData.fromUser = socket.user;
                            delete data.peerData.toUser;
                            socket.to(_sendToSocketId3).emit(_config.SOCKET_EVENTS.MESSAGE, {
                                type: _config.SOCKET_MESSAGE_TYPES.SOCKET_STATE,
                                payload: data.peerData
                            });
                        }
                        break;

                    case _config.SOCKET_MESSAGE_TYPES.RENEG_OFFER:
                        if (!_lodash2.default.isNil((0, _undefsafe2.default)(data, 'peerData.toUser.socketId'))) {
                            var _sendToSocketId4 = data.peerData.toUser.socketId;
                            data.peerData.fromUser = socket.user;
                            delete data.peerData.toUser;
                            socket.to(_sendToSocketId4).emit(_config.SOCKET_EVENTS.MESSAGE, {
                                type: _config.SOCKET_MESSAGE_TYPES.RENEG_OFFER,
                                payload: data.peerData
                            });
                        }
                        break;

                    case _config.SOCKET_MESSAGE_TYPES.RENEG_ANSWER:
                        if (!_lodash2.default.isNil((0, _undefsafe2.default)(data, 'peerData.fromUser.socketId'))) {
                            var _sendToSocketId5 = data.peerData.fromUser.socketId;
                            data.peerData.fromUser = socket.user;
                            socket.to(_sendToSocketId5).emit(_config.SOCKET_EVENTS.MESSAGE, {
                                type: _config.SOCKET_MESSAGE_TYPES.RENEG_ANSWER,
                                payload: data.peerData
                            });
                        }
                        break;
                }
            });
        }

        // retrive existing clients number

    }, {
        key: 'getExistingClientsNumber',
        value: function getExistingClientsNumber(roomId) {
            var _this4 = this;

            return new Promise(function (resolve, reject) {
                _this4._io.in(roomId).clients(function (err, clients) {
                    if (!err && _lodash2.default.isArray(clients)) {
                        resolve(clients.length);
                    } else {
                        resolve(0);
                    }
                });
            });
        }

        // handle disconnect

    }, {
        key: 'handleDisconnect',
        value: function handleDisconnect(socket) {
            socket.on(_config.SOCKET_EVENTS.DISCONNECT, function (s) {
                // inform others in the room
                SocketManager.setConnectedUser(socket.user._id, '', false);
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
    }], [{
        key: 'isUserConnected',
        value: function isUserConnected(userId, socketId) {
            return new Promise(function (resolve, reject) {
                _User2.default.findById(userId).then(function (user) {
                    if (user && user.socketInfo && user.socketInfo.connected && user.socketInfo.socketId != socketId) {
                        resolve(user.socketInfo.socketId);
                    } else {
                        resolve(false);
                    }
                }).catch(function (err) {
                    resolve(false);
                });
            });
        }
    }, {
        key: 'setConnectedUser',
        value: function setConnectedUser(userId, socketId) {
            var connected = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            return new Promise(function (resolve, reject) {
                _User2.default.findOneAndUpdate({
                    _id: userId
                }, {
                    socketInfo: {
                        connected: connected,
                        socketId: socketId
                    }
                }, {
                    new: true, upsert: false
                }).then(function (u) {
                    resolve(u);
                }).catch(function (err) {
                    // do nothing
                });
            });
        }

        // validate auth

    }, {
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