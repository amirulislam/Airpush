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

    // create a peer foreach
    createFilePeer(fileModel, user, messageUiId) {
        if (!PeerService.isRtcSupported()) {
            return;
        }
        let peer = new CustomPeer({ user, fileModel, peerType: PEER_TYPES.FILE_TRANSPORT });
        peer.onClose = p => {
            console.log('Peer connection CLOSED')
        }
        this._peers.push(peer);
        console.log('LOCAL PEER ID', peer._id);
        peer.createChanel().createOffer();
        peer.setMessageUi(messageUiId);
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
