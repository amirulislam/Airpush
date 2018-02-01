import io from 'socket.io-client';
import _ from 'lodash';
import StorageUtils from '../utils/Storage';
import { SOCKET_EVENTS } from '../config';
import { roomJoined } from '../actions';

let instance;
class SocketService {
    _isConnected = false;
    _socket;

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
        this.onError();               
    }

    // on connected
    onConnected() {
        this._socket.on(SOCKET_EVENTS.CONNECT, () => {
            console.log('connected!');
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
        console.log('Disconnect socket');
    }
    // on socket disconnected
    onDisconnected() {
        this._socket.on(SOCKET_EVENTS.DISCONNECT, () => {
            this._isConnected = false;
            console.log('Disconnected!');
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
            roomJoined(data.roomId);
        });
    }

    // join a room
    joinRoom(roomId) {
        if (!this._isConnected) {
            return;
        }         
    }

    // send message
    sendMessage() {
        if (!this._isConnected) {
            return;
        }         
        this._socket.emit('greet', { message: 'Hello Mr.Server!' });
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
