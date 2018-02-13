import User from '../../models/User';
import _ from 'lodash';
import debug from '../../utils/debug';
import safe from 'undefsafe';
import DetectRTC from 'detectrtc';
import { getAllUsers } from '../../actions';
import { PEER_TYPES } from '../../config';
import SimplePeer from './SimplePeer';

let instance;

class PeerService {

    // _peer;
    _isWebRtcSupported = false;
    _peers = [];

    constructor() {
        if (instance) {
            throw new Error('Can not instantiate like this');
        }
    }

    createPeer(user) {
        if (!PeerService.isRtcSupported()) {
            return;
        } 
        let peer = new SimplePeer({ user: new User(user)});
        this._peers.push(peer);
        peer.createOffer();
    }

    // create peer
    createPeerAndSetOffer(fromUser, signal) {
        if (!PeerService.isRtcSupported()) {
            return;
        }
        let peer = new SimplePeer({ user: new User(fromUser)});
        this._peers.push(peer);
        peer.setRemoteDescription(signal);
        peer.createAnswer();
    }
    
    setAnswerFromRemote(fromUser, signal) {
        let peer = this._getPeer(fromUser);
        if (peer) {
            peer.setLocalAndRemoteSignal(signal);      
        }
    }

    // set incoming ice candidate
    setIncomingIceCandidate(user, iceCandidate) {
        let peer = this._getPeer(user);
        if (peer) {
            peer.addIceCandidate(iceCandidate);      
        }        
    }

    // user left the room 
    removePeer(user) {
        let peer = this._getPeer(user);
        if (peer) {
            debug(['User left and found']);
            this._disconnectAndRemovePeer(peer);
        }          
    }

    _disconnectAndRemovePeer(peer) {
        debug(['Disconnect and remove peer 1', this._peers.length]);
        for (let i = 0; i < this._peers.length; i++) {
            if (peer._id === this._peers[i]._id) {
                debug(['Found it']);
                peer.closePeer();
                this._peers.splice(i, 1);
                break;
            }
        }
        debug(['Disconnect and remove peer 2', this._peers.length]);
    }

    // remove all peers
    disconnectAndRemoveAllPeers() {
        console.log('DIsconnect and remove all peers');
        for (let i = 0; i < this._peers.length; i++) {
            const peer = this._peers[i];
            peer.closePeer();
        }
        this._peers = [];
        debug(['All peers have been removed', this._peers.length]);
        // tbd - remove local stream
    }

    // find a peer
    _getPeer(u) {
        let peer = false;
        for (let i = 0; i < this._peers.length; i++) {
            if (this._peers[i]._user._id === u._id) {
                peer = this._peers[i];
                break;
            }
        }
        return peer;
    }

    // check if web rtc is supported
    static isRtcSupported() {
        return DetectRTC.isWebRTCSupported;
	}

    static getInstance() {
        if (!instance) {
            instance = new PeerService();
        }
        return instance;
    }
}

export default PeerService;
