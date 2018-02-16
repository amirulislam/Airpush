/* jshint node: true */
'use strict';

import JWT from '../utils/JWT';
import _ from 'lodash';
import safe from 'undefsafe';
import { SOCKET_EVENTS, SOCKET_MESSAGE_TYPES, CHAT_ROOM_MAX_CLIENTS } from '../config';
import shortId from 'shortid';
import HtmlValidator from '../utils/HtmlValidator';


class SocketManager {
    _io;

    constructor(io) {
        this._io = io;
        this.handleConnection();
    }

    handleConnection() {
        this._io.use((socket, next) => {
            const user = SocketManager.isValidAuth(socket.handshake.query.x__authorization);
            if (!user) {
                return next(new Error('AUTH_ERROR'));
            }
            socket.user = user;
            socket.user.socketId = socket.id;
            return next();
        });
        this._io.use((socket, next) => {
            // implement existing socket ERROR
            return next();
        });          
        this._io.on('connection', (socket) => {
            // console.log('ON CONNECTION ', socket.user);
            // this.handleJoinRoomEvent(socket);
            this.handleLeaveRoom(socket);
            this.handleCreateRoom(socket);
            this.handleJoinRoom(socket);
            this.handleMessages(socket);
            this.handleDisconnect(socket);
        });        
    }

    handleJoinRoomEvent(socket) {        
        const joinedRoomId = socket.handshake.query.joinedRoomId;
        if (joinedRoomId != 'false' && !_.isNil(joinedRoomId) && String(joinedRoomId).length < 30) {
            //console.log('JOIN ROOM >>>>>>', this.getExistingClientsNumber(joinedRoomId))
            socket.join(joinedRoomId);
            socket.room = {
                isCreator: false,
                roomId: joinedRoomId
            }                
            // emit to self
            socket.emit(SOCKET_EVENTS.JOINED_ROOM, { roomId: joinedRoomId });
            // emit to others
            socket.broadcast.to(joinedRoomId).emit(SOCKET_EVENTS.MESSAGE, {
                type: SOCKET_MESSAGE_TYPES.NEW_USER_JOINED,
                payload: Object.assign({type: SOCKET_MESSAGE_TYPES.NEW_USER_JOINED}, socket.user)
            });
        }
    }

    // handle create room
    handleCreateRoom(socket) {
        socket.on(SOCKET_EVENTS.CREATE_ROOM, data => {
            const roomId = String(shortId.generate());
            // console.log('CREATE ROOM', data, 'room id', roomId);

            socket.room = {
                isCreator: true,
                roomId: roomId
            }
            socket.join(roomId);
            socket.emit(SOCKET_EVENTS.ROOM_CREATED, { roomId });
        });
    }

    // handle join room
    handleJoinRoom(socket) {
        socket.on(SOCKET_EVENTS.JOIN_ROOM, data => {
            const { roomToJoin } = data;

            // leve if already belongs to another room
            if (!_.isNil(safe(socket, 'room.roomId')) && roomToJoin != socket.room.roomId) {
                socket.broadcast.to(socket.room.roomId).emit(SOCKET_EVENTS.MESSAGE, {
                    type: SOCKET_MESSAGE_TYPES.USER_LEAVED,
                    payload: Object.assign({type: SOCKET_MESSAGE_TYPES.USER_LEAVED}, socket.user)
                });
                socket.leave(socket.room.roomId);
            }
            
            const isAlreadyConnectedToRoom = !_.isNil(safe(socket, 'room.roomId')) && roomToJoin == socket.room.roomId;
            if (!isAlreadyConnectedToRoom && _.isString(roomToJoin) && String(roomToJoin).length < 20) { 
                this.getExistingClientsNumber(roomToJoin)
                .then(existingClientsNo => {
                    if (existingClientsNo >= CHAT_ROOM_MAX_CLIENTS) {
                        socket.emit(SOCKET_EVENTS.MESSAGE, { 
                            type: SOCKET_MESSAGE_TYPES.ROOM_FOOL_ERROR,
                            payload: {
                                message: `Maximum number of group chat participants has been reached. Maximum allowed users: ${CHAT_ROOM_MAX_CLIENTS}.`
                            }
                        });
                        return;
                    }
                    socket.room = {
                        isCreator: false,
                        roomId: roomToJoin
                    }
                    socket.join(roomToJoin);
                    // emit to self
                    socket.emit(SOCKET_EVENTS.JOINED_ROOM, { roomId: roomToJoin });
                    // emit to others
                    socket.broadcast.to(roomToJoin).emit(SOCKET_EVENTS.MESSAGE, {
                        type: SOCKET_MESSAGE_TYPES.NEW_USER_JOINED,
                        payload: Object.assign({type: SOCKET_MESSAGE_TYPES.NEW_USER_JOINED}, socket.user)
                    });                    
                })
                .catch(err => {});
            }
        });
    } 
    
    // retrive existing clients number
    getExistingClientsNumber(roomId) {
        return new Promise((resolve, reject) => {
            this._io.in(roomId).clients((err, clients) => {
                if (!err && _.isArray(clients)) {
                    resolve(clients.length);
                } else {
                    resolve(0);
                }
            })              
        });
    }       

    // handle disconnect
    handleDisconnect(socket) {
        socket.on(SOCKET_EVENTS.DISCONNECT, s => {
            // inform others in the room
            if (!_.isNil(safe(socket, 'room.roomId'))) {
                socket.broadcast.to(socket.room.roomId).emit(SOCKET_EVENTS.MESSAGE, {
                    type: SOCKET_MESSAGE_TYPES.USER_LEAVED,
                    payload: Object.assign({type: SOCKET_MESSAGE_TYPES.USER_LEAVED}, socket.user)
                });
                try {
                    // socket.leave(socket.room.roomId);
                } catch (e) {};
            }
        })
    }

    handleLeaveRoom(socket) {
        socket.on(SOCKET_EVENTS.LEAVE_ROOM, data => {
            // inform others
            // console.log(SOCKET_EVENTS.LEAVE_ROOM, socket.user);
            if (!_.isNil(safe(socket, 'room.roomId'))) {
                socket.broadcast.to(socket.room.roomId).emit(SOCKET_EVENTS.MESSAGE, {
                    type: SOCKET_MESSAGE_TYPES.USER_LEAVED,
                    payload: Object.assign({type: SOCKET_MESSAGE_TYPES.USER_LEAVED}, socket.user)
                });                
                socket.leave(socket.room.roomId);
            }
        })
    }

    // handle messages
    handleMessages(socket) {
        socket.on(SOCKET_EVENTS.MESSAGE, data => {
            if (_.isNil(safe(data, 'type'))) {
                return;
            }
            switch(data.type) {
                case SOCKET_MESSAGE_TYPES.TEXT_MESSAGE:
                    let text = HtmlValidator.removeAllTags(data.textMessage);
                    text = HtmlValidator.linkify(text);
                    text = HtmlValidator.validateMaxLength(text);
                    data.textMessage = text;
                    if (!_.isNil(safe(socket, 'room.roomId'))) {                      
                        this._io.in(socket.room.roomId).emit(SOCKET_EVENTS.MESSAGE, {
                            type: SOCKET_MESSAGE_TYPES.TEXT_MESSAGE,
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
                case SOCKET_MESSAGE_TYPES.PEER_SIGNAL:
                    if (!_.isNil(safe(data, 'peerData.toUser.socketId'))) {
                        const sendToSocketId = data.peerData.toUser.socketId;
                        data.peerData.fromUser = socket.user;
                        delete data.peerData.toUser;
                        socket.to(sendToSocketId).emit(SOCKET_EVENTS.MESSAGE, {
                                type: SOCKET_MESSAGE_TYPES.PEER_SIGNAL,
                                payload: data.peerData
                            }
                        );
                    }
                break;
                case SOCKET_MESSAGE_TYPES.PEER_SIGNAL_ANSWER:
                    if (!_.isNil(safe(data, 'peerData.fromUser.socketId'))) {
                        const sendToSocketId = data.peerData.fromUser.socketId;
                        data.peerData.fromUser = socket.user;
                        socket.to(sendToSocketId).emit(SOCKET_EVENTS.MESSAGE, {
                                type: SOCKET_MESSAGE_TYPES.PEER_SIGNAL_ANSWER,
                                payload: data.peerData
                            }
                        );
                    }               
                break;
                case SOCKET_MESSAGE_TYPES.PEER_SIGNAL_ICE:
                    // console.log('RECEIVED PEER_SIGNAL_ICE', data);
                    if (!_.isNil(safe(data, 'peerData.user.socketId'))) {
                        const sendToSocketId = data.peerData.user.socketId;
                        data.peerData.user = socket.user;
                        socket.to(sendToSocketId).emit(SOCKET_EVENTS.MESSAGE, {
                                type: SOCKET_MESSAGE_TYPES.PEER_SIGNAL_ICE,
                                payload: data.peerData
                            }
                        );
                    }               
                break;
                case SOCKET_MESSAGE_TYPES.SOCKET_STATE:
                    if (!_.isNil(safe(data, 'peerData.toUser.socketId'))) {
                        // console.log('RECEIVED SOCKET_STATE', data);
                        const sendToSocketId = data.peerData.toUser.socketId;
                        data.peerData.fromUser = socket.user;
                        delete data.peerData.toUser;
                        socket.to(sendToSocketId).emit(SOCKET_EVENTS.MESSAGE, {
                                type: SOCKET_MESSAGE_TYPES.SOCKET_STATE,
                                payload: data.peerData
                            }
                        );
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
        })
    }    

    // validate auth
    static isValidAuth(x__authorization) {
        const decoded = JWT.isValidToken(x__authorization);
		if (!_.isNil(safe(decoded, '_id'))) {
			return decoded;
        }
        return false;
    }  
}

export default SocketManager;
