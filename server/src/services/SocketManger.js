/* jshint node: true */
'use strict';

import JWT from '../utils/JWT';
import _ from 'lodash';
import safe from 'undefsafe';

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
        this._io.on('connection', function(socket) {
            console.log('ON CONNECTION ', socket.user);
            socket.on('greet', (data) => {
                console.log('GREET', data);
            })
            socket.on('disconnect', s => {
                console.log('SOcket server disconnect');
            })
        });        
    }

    static isValidAuth(x__authorization) {
        const decoded = JWT.isValidToken(x__authorization);
		if (!_.isNil(safe(decoded, '_id'))) {
			return decoded;
        }
        return false;
    }

}

export default SocketManager;
