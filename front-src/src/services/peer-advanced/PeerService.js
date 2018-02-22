import User from '../../models/User';
import _ from 'lodash';
import debug from '../../utils/debug';
import safe from 'undefsafe';
import DetectRTC from 'detectrtc';
import { getAllUsers } from '../../actions';
import { PEER_TYPES } from '../../config';
import SimplePeer from './SimplePeer';
import MediaManager from '../media/MediaManager';
import { removeSingleMediaSource } from '../../actions';

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
        MediaManager.getInstance().getUserMedia()
        .then(stream => {
            stream.getTracks().forEach(track => {
                    // console.log('ADD TRACK', track.enabled);
                    peer.addTrack(track, stream);
                }
            );            
            peer.createOffer();
        }).catch(err => {});
    }

    // create peer
    createPeerAndSetOffer(fromUser, signal) {
        if (!PeerService.isRtcSupported()) {
            return;
        }
        let peer = new SimplePeer({ user: new User(fromUser)});
        this._peers.push(peer);
        MediaManager.getInstance().getUserMedia()
        .then(stream => {
            stream.getTracks().forEach(track => {
                    peer.addTrack(track, stream);
                }
            );
            peer.setRemoteDescription(signal);
            peer.createAnswer();            
        }).catch(err => {});
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

    setIncomingState(fromUser, state) {
        let peer = this._getPeer(fromUser);
        if (peer) {
            peer.setRemoteReadyState(state);      
        }  
    }    

    renegociate() {
        for (let i = 0; i < this._peers.length; i++) {
            let peer = this._peers[i];
            let desktopStream = MediaManager.getInstance().getDesktopStream();
            let desktopTrack = MediaManager.getInstance().getDesktopTrack();
            peer.addDesktopTrack(desktopTrack, desktopStream);         
        }
    }    

    // incoming reneg offer 
    incommingRenegOffer(fromUser, signal) {
        if (!PeerService.isRtcSupported()) {
            return;
        }
        let peer = this._getPeer(fromUser);
        peer.setRemoteDescription(signal);
        peer.createRenegociationAnswer();
    }
    
    // incoming reneg answer 
    incommingRenegAnswer(fromUser, signal) {
        if (!PeerService.isRtcSupported()) {
            return;
        }
        let peer = this._getPeer(fromUser);
        if (peer) {
            peer.setRemoteDescription(signal);      
        }
    }    

    // user left the room 
    removePeer(user) {
        let peer = this._getPeer(user);
        if (peer) {
            removeSingleMediaSource(peer._id);
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
        for (let i = 0; i < this._peers.length; i++) {
            const peer = this._peers[i];
            peer.closePeer();
        }
        this._peers = [];
        debug(['All peers have been removed', this._peers.length]);
        MediaManager.getInstance().removeLocalStream();
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

    static checkTURNServer(turnConfig, timeout){ 

        return new Promise(function(resolve, reject){
      
          setTimeout(function(){
              if(promiseResolved) return;
              resolve(false);
              promiseResolved = true;
          }, timeout || 5000);
      
          var promiseResolved = false
            , myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection   //compatibility for firefox and chrome
            , pc = new myPeerConnection({iceServers:[turnConfig]})
            , noop = function(){};
          pc.createDataChannel("");    //create a bogus data channel
          pc.createOffer(function(sdp){
            if(sdp.sdp.indexOf('typ relay') > -1){ // sometimes sdp contains the ice candidates...
              promiseResolved = true;
              resolve(true);
            }
            pc.setLocalDescription(sdp, noop, noop);
          }, noop);    // create offer and set local description
          pc.onicecandidate = function(ice){  //listen for candidate events
            console.log('ICE >', ice.candidate)        
            if(promiseResolved || !ice || !ice.candidate || !ice.candidate.candidate || !(ice.candidate.candidate.indexOf('typ relay')>-1))  return;
            promiseResolved = true;
            resolve(true);
          };
        });   
      }
}

export default PeerService;

// PeerService.checkTURNServer({
//     url: 'turn:159.65.21.88:443',
//     username: 'airpush',
//     credential: 'ppps'
// }).then(function(bool){
//     console.log('is TURN server active? ', bool? 'yes':'no');
// }).catch(console.error.bind(console));