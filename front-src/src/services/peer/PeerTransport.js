import _ from 'lodash';
import SimplePeer from 'simple-peer';
import SocketService from '../SocketService';
import { SOCKET_EVENTS, SOCKET_MESSAGE_TYPES } from '../../config';
import { setTimeout } from 'timers';

class PeerTransport {

    _user;
    _peer;
    _isInitiator = false;
    _signalData;
    _isConnected = false;
    _receivedSignal = false;
    
    constructor(data) {
        this.init(data);
    }

    init(data) {
        if (!_.isNil(data.user)) {
            this._user = data.user;
        }
        if (!_.isNil(data.isInitiator)) {
            this._isInitiator = data.isInitiator;
        }

        if (data.signal) {
            this._receivedSignal = data.signal;
        }

        this.diconnect();
        console.log('PEER CONSTRUCT')
        this._peer = new SimplePeer({ initiator: this._isInitiator, trickle: false, reconnectTimer: 3000 });
        this._peer.on('signal', data => {
            this._signalData = JSON.stringify(data);
            console.log('PPPP IS READY: SIGNAL ', data);
            if (this._isInitiator) {
                this._signalOtherPeeer({
                    signal: this._signalData,
                    user: this._user
                });
            }          
            this.onPeerReady(this);
        });  
        
        if (this._receivedSignal) {
            this.triggerSignal();
        }        

        this._peer.on('connect', () => {
            this._isConnected = true;
            this.onPeerConnected(this);
            console.log('PEER CONNECTED >>>>>>>> ');
            // p.send('whatever' + Math.random())
        });

        this._peer.on('close', () => {
            this._isConnected = false;
            this.onPeerClose(this);
        });

        this._peer.on('data', data => {
            console.log('PEER DATA: ' + data)
        });

        this._peer.on('error', err => {
            console.log('PEER ERROR: ' + err);
        });               
    }

    // override
    onPeerReady() {}

    // override
    onPeerClose() {}

    // override
    onPeerConnected() {}

    isReady() {
        return this._signalData ? true : false;
    }

    isConnected() {
        return this._isConnected;
    }

    diconnect() {
        if (!_.isNil(this._peer)) {
            try {
                this._signalData = null;
                this._isConnected = false;
                this._peer.destroy();
                this.onPeerClose(this);
            } catch (err) {
                this.onPeerClose(this);
                console.log('PEER DESTROY ', err);
            }
        }
    }

    get user() {
        return this._user;
    }

    // signal others
    _signalOtherPeeer(peerData) {
        SocketService.getInstance().send({
            type: SOCKET_MESSAGE_TYPES.PEER_SIGNAL,
            peerData
        }, SOCKET_EVENTS.MESSAGE);
    }

    triggerSignal() {
        if (!this._receivedSignal) {
            return;
        }
        let signal = false;
        try {
            signal = JSON.parse(this._receivedSignal);
        } catch (e) {
            console.log(e);
        }
        if (signal) {            
            setTimeout(() => {
                console.log('TRIGGER SIGNAL NOW');
                this._peer.signal(signal);
            }, 2000)
        }
    }

}

export default PeerTransport;
