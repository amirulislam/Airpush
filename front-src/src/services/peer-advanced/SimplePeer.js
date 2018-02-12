import _ from 'lodash';
import safe from 'undefsafe';
import SocketService from '../SocketService';
import StorageUtils from '../../utils/Storage';
import shortid from 'shortid';

class SimplePeer {
    
    _servers = {
    	iceServers: [
            {urls: ['stun:stun.l.google.com:19302']},
            {urls: 'turn:138.68.165.213:3478?transport=udp'},
            {urls: 'turn:138.68.165.213:3478?transport=tcp'}
        ]
    };    
    _id = shortid.generate();
    _user;
    _dataChanel;

    constructor(data) {
        if (data.user) {
            this._user = user;
        }
        this._pc = new RTCPeerConnection(this._servers);
        this._pc.onicecandidate = event => {
            this.onIceCandidate(event);
        };
        this._pc.oniceconnectionstatechange = event => {
            console.log('ICE oniceconnectionstatechange ', event);
        };
        this._pc.ondatachannel = this._onDataChannelCallback.bind(this);       
    }

	// create chanel
    createChanel() {
        this._dataChanel = this._pc.createDataChannel('sendDataChannel');
        //this._dataChanel.binaryType = 'arraybuffer';
        //this._dataChanel.onopen = this._onOriginDataChannelStateChange.bind(this);
        //this._dataChanel.onclose = this._onOriginDataChannelStateChange.bind(this);
        // this._dataChanel.onmessage = this._onReceiveMessageCallback.bind(this);
        return this;
    }    

    onIceCandidate(event) {
        console.log('ON ICE CANDIDATE EVENT', event);
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

    
}

export default SimplePeer;
