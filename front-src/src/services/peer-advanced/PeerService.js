import User from '../../models/User';
import _ from 'lodash';
import safe from 'undefsafe';
import DetectRTC from 'detectrtc';
import { getAllUsers } from '../../actions';
import { PEER_TYPES } from '../../config';
import SimplePeer from './SimplePeer';

let instance;

class PeerService {

    _peer;
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
