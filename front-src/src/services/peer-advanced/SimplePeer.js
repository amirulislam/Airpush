import _ from 'lodash';
import safe from 'undefsafe';
import { SOCKET_EVENTS, SOCKET_MESSAGE_TYPES } from '../../config';
import SocketService from '../SocketService';
import StorageUtils from '../../utils/Storage';
import shortid from 'shortid';

class SimplePeer {
    
    _servers = {
    	iceServers: [
            {urls: ['stun:stun.l.google.com:19302']},
            {urls: 'turn:138.68.165.213:3478?transport=udp', credential: '3TptFG7cAfz5TaXsda', username: 'airpush'},
            {urls: 'turn:138.68.165.213:3478?transport=tcp', credential: '3TptFG7cAfz5TaXsda', username: 'airpush'}
        ]
    };    
    _id = shortid.generate();
    _user;
    _dataChanel;
    _offerOptions = {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1,
        voiceActivityDetection: false
    };    

    constructor(data) {
        if (data.user) {
            this._user = data.user;
        }
        this._pc = new RTCPeerConnection(this._servers);
        this._pc.onicecandidate = event => {
            this.onIceCandidate(event);
        };
        this._pc.oniceconnectionstatechange = event => {
            console.log('ICE oniceconnectionstatechange ', this._pc.iceConnectionState);
        };
        this._pc.ondatachannel = this._onDataChannelCallback.bind(this);       
    }

    // create offer
    createOffer() {
        this._pc.createOffer(this._offerOptions)
        .then(desc => {
            console.log('OFFER CREATED', desc);
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
        console.log('ON ICE CANDIDATE EVENT', event);
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
        console.log('Receive Channel Callback', event);
        this._dataChanel = event.channel;
        // this._dataChanel.binaryType = 'arraybuffer';
        // this._dataChanel.onmessage = this._onReceiveMessageCallback.bind(this);
        this._dataChanel.onopen = this._onDataChannelStateChange.bind(this);
        this._dataChanel.onclose = this._onDataChannelStateChange.bind(this);				
    }   
    
    _onDataChannelStateChange() { 
        if (!this._dataChanel) {
            this._readyState = false;
            return;
        }
        if (this._dataChanel.readyState === 'open') {
            this._readyState = true;    
        } else {
            this._readyState = false;
        }
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
                console.log('Ice candidate added');
            })
            .catch(err => {
                console.log('Ice candidate added error', err);
            })
        }
    }    

    
}

export default SimplePeer;
