import io from 'socket.io-client';
import _ from 'lodash';
import debug from '../utils/debug';
import StorageUtils from '../utils/Storage';
import { SOCKET_EVENTS, SOCKET_MESSAGE_TYPES } from '../config';
import { ALERT_MESSAGES_TYPES } from '../actions/Types';
import { roomJoined, sendNotification, roomCreated, roomJoinedBySelf,
 addUser, removeUser, dispatchInternalMessage, addMediaSource, removeAllMediaSources,
 openInfoAlert, openPopupAlertFromClass } from '../actions';
import Storage from '../utils/Storage';
import User from '../models/User';
import PeerService from './peer-advanced/PeerService';
import MediaManager from './media/MediaManager';

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

    connect(useHere = false) {
        if (this._isConnected) {
            return;
        }
        this._isConnected = true;
        const uri = `${window.location.protocol}//${window.location.host}`;
        this._socket = io(uri, {
            transports: ['websocket'],
            query: {
                x__authorization: StorageUtils.getToken(),
                x__useHere: useHere
                // joinedRoomId: StorageUtils.getJoinedRoom()
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
            this._acuireMediaAndJoinRoom();
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
            removeAllMediaSources();
            PeerService.getInstance().disconnectAndRemoveAllPeers();
        });
    }

    // create room
    createRoom() {
        if (!this._isConnected) {
            return;
        }
        this._acuireMediaAndCreateRoom();
        // this._socket.emit(SOCKET_EVENTS.CREATE_ROOM, { });
    }
    // on room created
    onRoomCreated() {
        this._socket.on(SOCKET_EVENTS.ROOM_CREATED, (data) => {
            // console.log('ROOM_CREATED', data);
            roomCreated(data.roomId);
            this._addSelfMediaSource();
        });
    }

    // on room join by myself
    onRoomJoin() {
        this._socket.on(SOCKET_EVENTS.JOINED_ROOM, data => {
            //console.log(SOCKET_EVENTS.JOINED_ROOM, data);
            roomJoinedBySelf(data.roomId);
            this._addSelfMediaSource();         
        });
    }

    // on user left
    onUserLeft() {
        this._socket.on(SOCKET_EVENTS.USER_LEFT, data => {
            // console.log(SOCKET_EVENTS.USER_LEFT, data);
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

    // inform newly created user about self
    informNewUserAboutSelf(newUser) {
        let me = new User(StorageUtils.getUser());
        this.send({
			type: SOCKET_MESSAGE_TYPES.USER_DISCOVER_SIGNAL,
			peerData: {
                sender: me,
                sendTo: newUser.socketId
			}
		}, SOCKET_EVENTS.MESSAGE);
    }

    // on message received
    onDataReceive() {
        this._socket.on(SOCKET_EVENTS.MESSAGE, data => {
            debug(['Message received', data]);
            switch(data.type) {
                case SOCKET_MESSAGE_TYPES.NEW_USER_JOINED:
                    addUser(data.payload);
                    this.informNewUserAboutSelf(data.payload);
                    PeerService.getInstance().createPeer(data.payload);
                    break;
                case SOCKET_MESSAGE_TYPES.USER_LEAVED:
                    removeUser(data.payload);
                    PeerService.getInstance().removePeer(data.payload);
                    break;
                case SOCKET_MESSAGE_TYPES.USER_DISCOVER_SIGNAL:
                    addUser(data.payload);
                    break;                    
                case SOCKET_MESSAGE_TYPES.TEXT_MESSAGE:
                    dispatchInternalMessage(data);
                    break;
                case SOCKET_MESSAGE_TYPES.ROOM_FOOL_ERROR:
                    openInfoAlert(data.payload, SOCKET_MESSAGE_TYPES.ROOM_FOOL_ERROR);
                    break;
                case SOCKET_MESSAGE_TYPES.ALREADY_CONNECTED_ERROR:
                    openInfoAlert(data.payload, SOCKET_MESSAGE_TYPES.ALREADY_CONNECTED_ERROR);
                    break;                               
                case SOCKET_MESSAGE_TYPES.PEER_SIGNAL:                    
                    PeerService.getInstance().createPeerAndSetOffer(data.payload.fromUser, data.payload.signal);
                    break;
                case SOCKET_MESSAGE_TYPES.PEER_SIGNAL_ANSWER:
                    PeerService.getInstance().setAnswerFromRemote(data.payload.fromUser, data.payload.signal);
                    break;
                case SOCKET_MESSAGE_TYPES.PEER_SIGNAL_ICE:
                    PeerService.getInstance().setIncomingIceCandidate(data.payload.user, data.payload.candidate);
                    break;
                case SOCKET_MESSAGE_TYPES.SOCKET_STATE:
                    PeerService.getInstance().setIncomingState(data.payload.fromUser, data.payload.state);
                    break;
                case SOCKET_MESSAGE_TYPES.OTHER_CLIENT_USAGE:
                    this._socket.disconnect();
                    window.location = '/';
                    break;                                                                                                         
            }
        });
    }

    _acuireMediaAndJoinRoom() {
        const joinedRoomId = StorageUtils.getJoinedRoom();
        if (joinedRoomId) {
            MediaManager.getInstance().getUserMedia()
            .then(stream => {
                this.joinRoom(joinedRoomId);  
            })
            .catch(err => {
                this._mediaRefuseError(err, false);
            })
        }        
    }

    _acuireMediaAndCreateRoom() {
        MediaManager.getInstance().getUserMedia()
        .then(stream => {
            this._socket.emit(SOCKET_EVENTS.CREATE_ROOM, { });
        })
        .catch(err => {
            this._mediaRefuseError(err, true);
        })  
    }    

    _mediaRefuseError(err) {
        console.log('err', err);
        openPopupAlertFromClass({}, ALERT_MESSAGES_TYPES.MELDIA_NEEDED);
    }
    
    _addSelfMediaSource() {
        MediaManager.getInstance().getUserMedia()
        .then(stream => {
            addMediaSource({
                stream,
                peerId: 'me',
                isOpen: true,
                user: new User(StorageUtils.getUser())
            });
        }).catch(err => {}) 
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
