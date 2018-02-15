import _ from 'lodash';
import safe from 'undefsafe';
import debug from '../../utils/debug';
import { SOCKET_EVENTS, SOCKET_MESSAGE_TYPES, ICE_SERVERS } from '../../config';
import SocketService from '../SocketService';
import StorageUtils from '../../utils/Storage';
import shortid from 'shortid';
import { addMediaSource } from '../../actions';

// {urls: ['stun:stun.l.google.com:19302']},
// {urls: 'turn:159.65.21.88:443', credential: '', username: 'airpush'}

const _servers = {
    iceServers: ICE_SERVERS
};    

class SimplePeer {
    
    _id = shortid.generate();
    _user;
    _dataChanel;
    _offerOptions = {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1,
        voiceActivityDetection: false
    };
    _readyState;
    _readyRemoteState;
    _remoteStream;

    constructor(data) {
        if (data.user) {
            this._user = data.user;
        }
        this._pc = new RTCPeerConnection(_servers);
        this._pc.onicecandidate = event => {
            this.onIceCandidate(event);
        };
        this._pc.oniceconnectionstatechange = event => {
            debug(['ICE oniceconnectionstatechange ', this._pc.iceConnectionState]);
            if (this._pc.iceConnectionState === 'connected') {
                this._readyState = true;
            }
            
            if (this._readyState) {
                this._sendReadyState();
            }
            this.onStateChange();
        };

        // once remote stream arrives, show it in the remote video element
        this._pc.ontrack = evt => {
            if (evt && evt.streams && evt.streams[0]) {
                if (this._remoteStream !== evt.streams[0]) {
                    this._remoteStream = evt.streams[0];
                    addMediaSource({
                        stream: this._remoteStream,
                        peerId: this._id,
                        isOpen: false,
                        user: this._user
                    });
                }
            }
        };

        this._pc.ondatachannel = this._onDataChannelCallback.bind(this);       
    }

    // create offer
    createOffer() {
        this._pc.createOffer(this._offerOptions)
        .then(desc => {
            debug(['OFFER CREATED', desc]);
            this._localDescription = desc;
            // this.setLocalDescription(desc);
            SocketService.getInstance().send({
                type: SOCKET_MESSAGE_TYPES.PEER_SIGNAL,
                peerData: {
                    signal: this._localDescription,
                    toUser: this._user
                }
            }, SOCKET_EVENTS.MESSAGE);
        })
        .catch(err => {
            console.log('Offer error - Failed to create session description', err);
        });
        return this;
    }
    
    // create answer
    createAnswer() {
        this._pc.createAnswer()
        .then(desc => {
            this._localDescription = desc;
            this.setLocalDescription(desc);
            SocketService.getInstance().send({
                type: SOCKET_MESSAGE_TYPES.PEER_SIGNAL_ANSWER,
                peerData: {
                    signal: this._localDescription,
                    fromUser: this._user
                }
            }, SOCKET_EVENTS.MESSAGE);
        })
        .catch(err => {
            console.log('Answer error', err);
        })
    }    

	// // create chanel
    // createChanel() {
    //     this._dataChanel = this._pc.createDataChannel('sendDataChannel');
    //     //this._dataChanel.binaryType = 'arraybuffer';
    //     //this._dataChanel.onopen = this._onOriginDataChannelStateChange.bind(this);
    //     //this._dataChanel.onclose = this._onOriginDataChannelStateChange.bind(this);
    //     // this._dataChanel.onmessage = this._onReceiveMessageCallback.bind(this);
    //     return this;
    // }    

    onIceCandidate(event) {
        debug(['ON ICE CANDIDATE EVENT', event.candidate]);
        if (event.candidate) {
            SocketService.getInstance().send({
                type: SOCKET_MESSAGE_TYPES.PEER_SIGNAL_ICE,
                peerData: {
                    candidate: event.candidate,
                    user: this._user
                }
            }, SOCKET_EVENTS.MESSAGE);			
        }         
    }

    _onDataChannelCallback(event) {
        debug(['Receive Channel Callback', event]);
        this._dataChanel = event.channel;
        // this._dataChanel.binaryType = 'arraybuffer';
        // this._dataChanel.onmessage = this._onReceiveMessageCallback.bind(this);
        this._dataChanel.onopen = this._onDataChannelStateChange.bind(this);
        this._dataChanel.onclose = this._onDataChannelStateChange.bind(this);				
    }   
    
    _onDataChannelStateChange() { 
        // if (!this._dataChanel) {
        //     this._readyState = false;
        //     return;
        // }
        // if (this._dataChanel.readyState === 'open') {
        //     this._readyState = true;    
        // } else {
        //     this._readyState = false;
        // }
    } 
    
    setLocalDescription(desc) {
        this._pc.setLocalDescription(desc);
    }

    setLocalAndRemoteSignal(remoteSignal) {
        this.setLocalDescription(this._localDescription);
        this.setRemoteDescription(remoteSignal);
    }

    // set remote desc
    setRemoteDescription(desc) {
        this.remoteDescription = desc;
        this._pc.setRemoteDescription(desc);
    } 
    
    // add ice candidate
    addIceCandidate(candidate) {
        if (candidate && this._pc) {
            this._pc.addIceCandidate(candidate)
            .then(() => {
                debug(['Ice candidate added']);
            })
            .catch(err => {
                console.log('Ice candidate added error', err);
            })
        }
    }

    onStateChange() {
        if (this._readyState && this._readyRemoteState) {
            console.log('BOTH PEERS ARE READY',);
            this.onBothPeersReadyEvent(this);
        }
    }

    // override
    onBothPeersReadyEvent(peer) {}

    setRemoteReadyState(state) {
        this._readyRemoteState = state;
        this.onStateChange();
    }

    _sendReadyState() {
        SocketService.getInstance().send({
            type: SOCKET_MESSAGE_TYPES.SOCKET_STATE,
            peerData: {
                state: this._readyState,
                toUser: this._user
            }
        }, SOCKET_EVENTS.MESSAGE);
    }

    get pc() {
        return this._pc;
    }

    // close peer and channels (if any)
    closePeer() {
        try {
            this._remoteStream = null;
        } catch (err) {}
        try {
            this._pc.close();
        } catch (err) {
            console.log('close');
        }
    }

    static isRelay(ice) {
        if(!ice || !ice.candidate || !ice.candidate.candidate || !(ice.candidate.candidate.indexOf('typ relay')>-1)) {
            return true;
        } else {
            return false;
        } 
    }
    
}

export default SimplePeer;
