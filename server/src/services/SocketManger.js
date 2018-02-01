/* jshint node: true */
'use strict';

import JWT from '../utils/JWT';
import _ from 'lodash';
import safe from 'undefsafe';
import { SOCKET_EVENTS } from '../config';
import shortId from 'shortid';


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
            return next();
        });  
        this._io.on('connection', (socket) => {
            console.log('ON CONNECTION ', socket.user);

            socket.on('greet', (data) => {
                console.log('GREET', data);
            })

            this.handleCreateRoom(socket);

            this.handleDisconnect(socket);
        });        
    }

    // handle create room
    handleCreateRoom(socket) {
        socket.on(SOCKET_EVENTS.CREATE_ROOM, data => {
            console.log('CREATE ROOM', data, 'SOket', socket.id);

            const roomId = String(shortId.generate());
            socket.room = {
                isCreator: true,
                roomId: roomId
            }
            socket.join(roomId);
            socket.emit(SOCKET_EVENTS.ROOM_CREATED, { roomId });
        });
    }

    // handle disconnect
    handleDisconnect(socket) {
        socket.on(SOCKET_EVENTS.DISCONNECT, s => {
            // inform others in the room
            console.log('SOcket server disconnect');
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
