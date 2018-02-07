import io from 'socket.io-client';
import _ from 'lodash';
import StorageUtils from '../utils/Storage';
import { SOCKET_EVENTS, SOCKET_MESSAGE_TYPES } from '../config';
import { roomJoined, sendNotification, roomCreated, roomJoinedBySelf,
 addUser, removeUser, dispatchInternalMessage } from '../actions';
import Storage from '../utils/Storage';
import PeerService from './peer/PeerService';
import User from '../models/User';

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
        PeerService.getInstance();
    }

    connect() {
        if (this._isConnected) {
            return;
        }
        this._isConnected = true;
        const uri = `${window.location.protocol}//${window.location.host}`;
        this._socket = io(uri, {
            transports: ['websocket'],
            query: {
                x__authorization: StorageUtils.getToken(),
                joinedRoomId: StorageUtils.getJoinedRoom()
            }
        });

        this.onConnected();
        this.onDisconnected();
        this.onRoomCreated();
        this.onRoomJoin();
        this.onDataReceive();
        this.onError();
        this.onDisconnected();              
    }

    // on connected
    onConnected() {
        this._socket.on(SOCKET_EVENTS.CONNECT, () => {
            console.log('Connected!');
            this._isConnected = true;
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

    // on room join by myself
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
        console.log('JOIN_ROOM_NOW!!!!>>>>>');
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
            switch(data.type) {
                case SOCKET_MESSAGE_TYPES.NEW_USER_JOINED:
                    console.log(SOCKET_MESSAGE_TYPES.NEW_USER_JOINED);                    
                    addUser(data.payload);
                    PeerService.getInstance().createPeer(new User(data.payload, ['email', 'role', 'type', 'iat']));
                    break;
                case SOCKET_MESSAGE_TYPES.USER_LEAVED:
                    // console.log('--->>>' + SOCKET_MESSAGE_TYPES.USER_LEAVED, data.payload);
                    PeerService.getInstance().removePeer(new User(data.payload));
                    removeUser(data.payload);                    
                    break;
                case SOCKET_MESSAGE_TYPES.TEXT_MESSAGE:
                    // console.log('--->>>' + SOCKET_MESSAGE_TYPES.TEXT_MESSAGE);
                    dispatchInternalMessage(data);
                    break;
                case SOCKET_MESSAGE_TYPES.PEER_SIGNAL:
                    console.log('PEER SIGNAL RECEIVED--->>>', data);
                    PeerService.getInstance().creatAndSetRemoteDescription(data);
                    break;
                case SOCKET_MESSAGE_TYPES.PEER_SIGNAL_ANSWER:
                    console.log('PEER_SIGNAL_ANSWER--->>>', data);
                    PeerService.getInstance().setAnswerFromRemote(data);
                    break;
                case SOCKET_MESSAGE_TYPES.PEER_SIGNAL_ICE:
                    console.log('PEER_SIGNAL_ICE--->>>', data);
                    PeerService.getInstance().setIncomingIceCandidate(data);
                    break;                                                                                     
            }
        });
    }

    onError() {
        this._socket.on(SOCKET_EVENTS.ERROR, err => {
            console.log('Errror', err);
        });         
    }

    onDisconnect() {
        this._socket.on('disconnect', reason => {
            this._isConnected = false;
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
