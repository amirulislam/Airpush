import CustomPeer from './CustomPeer';
import User from '../../models/User';
import _ from 'lodash';
import safe from 'undefsafe';
import FileTransferHelper from '../../services/peer/transport/FileTransferHelper';

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
        if (!CustomPeer.isRtcSupported()) {
            return;
        }
        this._isWebRtcSupported = true;
    }

    createPeer(user, signal = false) {
        if (!this._isWebRtcSupported) {
            return;
        }
        if (this._peerExists(user)) {
            return;
        }
        let peer = new CustomPeer({
            user
        });
        peer.onClose = p => {
            console.log('Peer connection CLOSED')
        }
        this._peers.push(peer);        
        if (!signal) {
            peer.createChanel().createOffer();
            return peer;
        } else {
			peer.setRemoteDescription(signal);
			// peer.onIceCandidate = candidate => {
            //     if (candidate) {
            //         console.log('Remote peer ice candidate send it');
            //     }
			// 	// localPeer.addIceCandidate(candidate);
			// }			
			// peer.onAnswerCreated = answerDesc => {
			// 	console.log('ON ANSWER CREATED - send it to source', answerDesc);
			// 	// onDescriptionFromRemote(answerDesc);
            // }
            peer.createAnswer();
        }
        console.log('CODE FOR PEER TO SET SIGNAL')
        console.log('PEER CREATED ', this._peers.length);
    }

    removePeer(user) {
        const peerData = this._peerExists(user);
        if (!peerData) {
            return;
        }
        peerData.peer.disconnect();
        this._peers.splice(peerData.index, 1);
        console.log('PEER REMOVED ', this._peers.length);
    }

    creatAndSetRemoteDescription(data) {
        console.log('CREATE SET REMOTE DESCRIPTION', data)
        if (_.isNil(safe(data, 'payload.user')) || _.isNil(safe(data, 'payload.signal'))) {
            return;
        }
        let peer = this.createPeer(new User(data.payload.user), data.payload.signal);
    }

    // set answer from remote
    setAnswerFromRemote(data) {
        if (_.isNil(safe(data, 'payload.user')) || _.isNil(safe(data, 'payload.signal'))) {
            return;
        }
        const peeerExists = this._peerExists(data.payload.user);
        if (peeerExists && !_.isNil(peeerExists.peer)) {
            const peer = peeerExists.peer;
            console.log('ANSWER SET>>> ');
            peer.setRemoteDescription(data.payload.signal);
        }
    }

    setIncomingIceCandidate(data) {
        if (_.isNil(safe(data, 'payload.user')) || _.isNil(safe(data, 'payload.candidate'))) {
            return;
        }
        const peeerExists = this._peerExists(data.payload.user);
        if (peeerExists && !_.isNil(peeerExists.peer)) {
            const peer = peeerExists.peer;
            console.log('ANSWER SET>>> ');
            peer.addIceCandidate(data.payload.candidate);
        } 
    }

    // send file to all peers
    sendFile(file) {
        if (!this._isWebRtcSupported || this._peers.length === 0 || !file) {
            return false;
        }
        for (let i = 0; i < this._peers.length; i++) {
            console.log('send to peer');
            new FileTransferHelper(file, this._peers[i]);
            // this._peers[i].sendFile();
        }
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

    static getInstance() {
        if (!instance) {
            instance = new PeerService();
        }
        return instance;
    }
}

export default PeerService;
