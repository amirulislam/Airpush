import CustomPeer from './CustomPeer';
import User from '../../models/User';
import FileService from '../files/FileService';
import _ from 'lodash';
import safe from 'undefsafe';
import FileTransferHelper from '../../services/peer/transport/FileTransferHelper';
import { getAllUsers } from '../../actions';
import { PEER_TYPES } from '../../config';

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

    // create a peer foreach
    createFilePeer(fileModel, user, messageUiId) {
        if (!this._isWebRtcSupported) {
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

    createFilePeerAndSetRemoteDescription(data) {
        if (_.isNil(safe(data, 'payload.user')) || _.isNil(safe(data, 'payload.signal')) || _.isNil(safe(data, 'payload.fileModel'))) {
            return;
        }

        let fileModelExists = FileService.getInstance().getFileById(data.payload.fileModel._id);
        if (!fileModelExists) {
            return;
        }

        let peer = new CustomPeer({ 
            user: data.payload.user,
            fileModel: fileModelExists,
            peerType: PEER_TYPES.FILE_TRANSPORT,
            remotePeerId: data.payload.remotePeerId,
            _id: data.payload.propseId
        });
        console.log('LOCAL PEER ID', peer._id);
        this._peers.push(peer);
        peer.setRemoteDescription(data.payload.signal);
        peer.createAnswer();
        // setTimeout(() => {
        //     console.log('ON TIME');
        //     peer.send('hello222')
        // }, 4000);        
    }    

    // set answer from remote
    setAnswerFromRemote(data) {
        if (_.isNil(safe(data, 'payload.user')) || _.isNil(safe(data, 'payload.signal')) || _.isNil(safe(data, 'payload.fileModel'))) {
            return;
        }
        let existingPeerData = this._findPeerById(data.payload.originalCallFromId);
        if (!existingPeerData) {
            return;
        }
        existingPeerData.peer.setRemotePeerId(data.payload.remotePeerId);
        existingPeerData.peer.setRemoteDescription(data.payload.signal);
    }

    // set remote candidate
    setIncomingIceCandidate(data) {
        if (_.isNil(safe(data, 'payload.user')) || _.isNil(safe(data, 'payload.candidate')) || _.isNil(safe(data, 'payload.toPeerId'))) {
            return;
        }
        let existingPeerData = this._findPeerById(data.payload.toPeerId);
        if (!existingPeerData) {
            return;
        }
        existingPeerData.peer.addIceCandidate(data.payload.candidate);
    }    

    setRemoteReady(data) {
        if (_.isNil(safe(data, 'payload.toPeerId'))) {
            return;
        }
        let existingPeerData = this._findPeerById(data.payload.toPeerId);
        if (!existingPeerData) {
            return;
        }
        existingPeerData.peer.remoteIsReady = true;
    }


    _findPeerById(peerId) {
        let p = false;
        for (let i = 0; i < this._peers.length; i++) {
            if (this._peers[i]._id === peerId) {
                p = {
                    peer: this._peers[i],
                    index: i
                };
                break;
            }
        }        
        return p;
    }


    // createPeer(user, signal = false) {
    //     if (!this._isWebRtcSupported) {
    //         return;
    //     }
    //     if (this._peerExists(user)) {
    //         return;
    //     }
    //     let peer = new CustomPeer({
    //         user
    //     });
    //     peer.onClose = p => {
    //         console.log('Peer connection CLOSED')
    //     }
    //     this._peers.push(peer);     
    //     if (!signal) {
    //         peer.createChanel().createOffer();
    //         return peer;
    //     } else {
	// 		peer.setRemoteDescription(signal);
	// 		// peer.onIceCandidate = candidate => {
    //         //     if (candidate) {
    //         //         console.log('Remote peer ice candidate send it');
    //         //     }
	// 		// 	// localPeer.addIceCandidate(candidate);
	// 		// }			
	// 		// peer.onAnswerCreated = answerDesc => {
	// 		// 	console.log('ON ANSWER CREATED - send it to source', answerDesc);
	// 		// 	// onDescriptionFromRemote(answerDesc);
    //         // }
    //         peer.createAnswer();
    //     }
    //     console.log('CODE FOR PEER TO SET SIGNAL')
    //     console.log('PEER CREATED ', this._peers.length);
    // }

    removePeer(user) {
        const peerData = this._peerExists(user);
        if (!peerData) {
            return;
        }
        peerData.peer.disconnect();
        this._peers.splice(peerData.index, 1);
        console.log('PEER REMOVED ', this._peers.length);
    }

    // setIncomingIceCandidate(data) {
    //     if (_.isNil(safe(data, 'payload.user')) || _.isNil(safe(data, 'payload.candidate'))) {
    //         return;
    //     }
    //     const peeerExists = this._peerExists(data.payload.user);
    //     if (peeerExists && !_.isNil(peeerExists.peer)) {
    //         const peer = peeerExists.peer;
    //         console.log('ANSWER SET>>> ');
    //         peer.addIceCandidate(data.payload.candidate);
    //     } 
    // }

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
