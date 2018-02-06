import PeerTransport from './PeerTransport';
import SimplePeer from 'simple-peer';
import User from '../../models/User';

let instance;

class PeerService {

    _peer;
    _isWebRtcSupported = false;
    _peers = [];

    constructor() {
        if (instance) {
            throw new Error('Can not instantiate like this');
        }
        this.init();
    }

    init() {
        if (!SimplePeer.WEBRTC_SUPPORT) {
            return;
        }
        this._isWebRtcSupported = true;
    }

    createPeer(user = {}, isInitiator = true, signal = false) {
        if (!this._isWebRtcSupported) {
            return;
        }
        if (this._peerExists(user)) {
            return;
        }
        let peer = new PeerTransport({
            user,
            isInitiator,
            signal
        });
        peer.onClose = p => {
            console.log('Peer connection CLOSED')
        }         
        this._peers.push(peer);
        return peer;
    }

    removePeer(user) {
        const peerData = this._peerExists(user);
        if (!peerData) {
            return;
        }
        peerData.peer.diconnect();
        this._peers.splice(peerData.index, 1);
    }

    // retun peer of exists
    _peerExists(user) {
        let p = false;
        for (let i = 0; i < this._peers.length; i++) {
            if (this._peers[i].user._id === user._id) {
                p = {
                    peer: this._peers[i],
                    index: i
                };
                break;
            }
        }
        return p;
    }

    connectToPeer(peerToConnect) {
        let existingPeer = this._peerExists(peerToConnect.payload.user);
        console.log('CONNECTING TO PEER ', this._peers.length, existingPeer);
        if (existingPeer) {
            return;
        }
        const peer = this.createPeer(new User(peerToConnect.payload.user), false, peerToConnect.payload.signal);
        console.log('CONNECTING TO PEER 2', peer);
        // peer.triggerSignal();
    }

    static getInstance() {
        if (!instance) {
            instance = new PeerService();
        }
        return instance;
    }
}

export default PeerService;
