import io from 'socket.io-client';
import _ from 'lodash';
import StorageUtils from '../utils/Storage';
import { SOCKET_EVENTS, SOCKET_MESSAGE_TYPES } from '../config';
import { roomJoined, sendNotification, roomCreated, roomJoinedBySelf } from '../actions';

let instance;
class SocketService {
    _isConnected = false;
    _socket;
    _joinTrials = 0;
    _maxJoinTrials = 5;

    constructor() {
        if (instance) {
            throw new Error('Can not instantiate like this');
        }
    }

    connect() {
        if (this._isConnected) {
            return;
        }
        const uri = `${window.location.protocol}//${window.location.host}`;
        this._socket = io(uri, {
            transports: ['websocket'],
            query: {
                x__authorization: StorageUtils.getToken()
            }
        });

        this.onConnected();
        this.onDisconnected();
        this.onRoomCreated();
        this.onRoomJoin();
        this.onDataReceive();
        this.onError();               
    }

    // on connected
    onConnected() {
        this._socket.on(SOCKET_EVENTS.CONNECT, () => {
            // sendNotification("Connected!");
            console.log('Connected!');
            this._isConnected = true;
            this._socket.emit('greet', { message: 'Hello Mr.Server!' });
        });
    }

    // disconnect socket
    disconnect() {
        if (!this._isConnected) {
            return;
        } 
        this._socket.disconnect();
        this._isConnected = false;
    }
    // on socket disconnected
    onDisconnected() {
        this._socket.on(SOCKET_EVENTS.DISCONNECT, () => {
            this._isConnected = false;
            sendNotification('Disconnected');
        });
    }

    // create room
    createRoom() {
        if (!this._isConnected) {
            return;
        }
        this._socket.emit(SOCKET_EVENTS.CREATE_ROOM, { });
    }
    // on room created
    onRoomCreated() {
        this._socket.on(SOCKET_EVENTS.ROOM_CREATED, (data) => {
            console.log('ROOM_CREATED', data);
            roomCreated(data.roomId);
        });
    }

    // on room created
    onRoomJoin() {
        this._socket.on(SOCKET_EVENTS.JOINED_ROOM, data => {
            console.log(SOCKET_EVENTS.JOINED_ROOM, data);
            roomJoinedBySelf(data.roomId);
        });
    }

    // on user left
    onUserLeft() {
        this._socket.on(SOCKET_EVENTS.USER_LEFT, data => {
            console.log(SOCKET_EVENTS.USER_LEFT, data);
        });
    }

    // join a room
    joinRoom(roomToJoin) {
        if (!this._isConnected && this._joinTrials < this._maxJoinTrials) {
            this._joinTrials++;
            setTimeout(() => {
                this.joinRoom(roomToJoin);
            }, 1500);
            return;
        }
        this._joinTrials = 0;
        this._socket.emit(SOCKET_EVENTS.JOIN_ROOM, { roomToJoin });
    }

    // send data
    send(data, eventType) {
        if (!this._isConnected) {
            return;
        }         
        this._socket.emit(eventType, data);
    }

    // on message received
    onDataReceive() {
        this._socket.on(SOCKET_EVENTS.MESSAGE, data => {
            console.log('Message received', data);
        });         
    }

    onError() {
        this._socket.on(SOCKET_EVENTS.ERROR, err => {
            console.log('Errror', err);
        });         
    }

    static getInstance() {
        if (!instance) {
            instance = new SocketService();
        }
        return instance;
    }
}
export default SocketService;
