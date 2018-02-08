import SocketService from '../SocketService';
import StorageUtils from '../../utils/Storage';
import { SOCKET_EVENTS, SOCKET_MESSAGE_TYPES, PEER_TYPES} from '../../config';
import _ from 'lodash';
import DetectRTC from 'detectrtc';
import shortid from 'shortid';

class CustomPeer {
	
    _pc;
    _servers = {
    	iceServers: [{urls: ['stun:stun.l.google.com:19302']}]
    };
    _dataChanel;
    _receiveChanel;
    _rawLocalDescription;
    _rawRemoteDescription;
    _readyState;
    _readyReceiveState;
    _user = {};
    _fileModel = {};
    _peerType = PEER_TYPES.FILE_TRANSPORT;
    _id = shortid.generate();
    _remotePeerId;

    constructor(data) {        
        if (!_.isNil(data.user)) {
            this._user = data.user;
        }
        
        if (!_.isNil(data.fileModel)) {
            this._fileModel = data.fileModel;
        }
        
        if (!_.isNil(data.peerType)) {
            this._peerType = data.peerType;
        }  

        if (!_.isNil(data.remotePeerId)) {
            this._remotePeerId = data.remotePeerId;
        }
        
        if (!_.isNil(data._id)) {
            this._id = data._id;
        }         
		
        if (!_.isNil(data.iceServers)) {
            this._servers.iceServers = data.iceServers;
        }
        
        // this._sendIceCandidate = this._sendIceCandidate.bind(this);

        this._pc = new RTCPeerConnection(this._servers);
        this._pc.onicecandidate = event => {

            if (event.candidate) {
                SocketService.getInstance().send({
                    type: SOCKET_MESSAGE_TYPES.PEER_SIGNAL_ICE,
                    peerData: {
                        candidate: event.candidate,
                        user: this._user,
                        toPeerId: this._remotePeerId
                    }
                }, SOCKET_EVENTS.MESSAGE);			
            }

            this.onIceCandidate(event.candidate, this._remotePeerId);
        };
        this._pc.oniceconnectionstatechange = event => {
        };
        this._pc.ondatachannel = this._onDataChannelCallback.bind(this);
    }

    setRemotePeerId(id) {
        this._remotePeerId = id;
    }

	// create chanel
    createChanel() {
        this._dataChanel = this._pc.createDataChannel('sendDataChannel');
        this._dataChanel.binaryType = 'arraybuffer';
        this._dataChanel.onopen = this._onOriginDataChannelStateChange.bind(this);
        this._dataChanel.onclose = this._onOriginDataChannelStateChange.bind(this);
        this._dataChanel.onmessage = this._onReceiveMessageCallback.bind(this);
        return this;
    }

    _getOferOptions() {
        return {
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1
        }				
    }

    _onOriginDataChannelStateChange() { 
        if (!this._dataChanel) {
            this._readyState = false;
            return;
		}
        this._readyState = this._dataChanel.readyState === 'open' ? true : false;
        console.log('OrIGIN CHANEL STATE CHANGE ', this._dataChanel.readyState);
        if (!this._readyState && this.onClose) {
			this.onClose(this);
		}
    }     

    _onDataChannelStateChange() { 
        if (!this._dataChanel) {
            this._readyState = false;
            return;
		}
		this._readyState = this._dataChanel.readyState === 'open' ? true : false;
        if (!this._readyState && this.onClose) {
			this.onClose(this);
		}
    } 
    
    _onReceiveMessageCallback(event) {
        console.log('ON RECEIVE BITES', event.data);
    }

    _onDataChannelCallback(event) {
        console.log('Receive Channel Callback', event);
        this._dataChanel = event.channel;
        this._dataChanel.binaryType = 'arraybuffer';
        this._dataChanel.onmessage = this._onReceiveMessageCallback.bind(this);
        this._dataChanel.onopen = this._onDataChannelStateChange.bind(this);
        this._dataChanel.onclose = this._onDataChannelStateChange.bind(this);				
    }

    // set remote description
    setRemoteDescription(desc) {
        this._pc.setRemoteDescription(desc);
        return this;
    }

    // create offer
    createOffer() {
        this._pc.createOffer()
        .then(desc => {
			this.setLocalDescription(desc);
			this._signalOtherPeeer();
            this.onOfferCreated(desc);
        })
        .catch(err => {
            console.log('Offer error - Failed to create session description', err);;
        });
        return this;
    }

    // create answer
    createAnswer() {
        this._pc.createAnswer()
        .then(desc => {
			this.setLocalDescription(desc);
			this._signalAnswerBack();
            this.onAnswerCreated(desc);
        })
        .catch(err => {
            console.log('Answer error', err);
        })
    }

    // set local desc
    setLocalDescription(desc) {
        this._rawLocalDescription = desc;
        return this._pc.setLocalDescription(desc);
    }

    // set remote desc
    setRemoteDescription(desc) {
        this._rawRemoteDescription = desc;
        this._pc.setRemoteDescription(desc);
    }

    // add ice candidate
    addIceCandidate(candidate) {
        if (candidate && this._pc) {
            this._pc.addIceCandidate(candidate)
            .then(() => {
                // console.log('Ice candidate added');
            })
            .catch(err => {
                console.log('Ice candidate added error', err);
            })
        }
    }

	// signal other peer 
	// use your own socket implementation to trasport signal data
    _signalOtherPeeer() {
        console.log('Signal other peer');
        const propseId = shortid.generate();
        this.setRemotePeerId(propseId);
        SocketService.getInstance().send({
			type: SOCKET_MESSAGE_TYPES.PEER_SIGNAL,
			peerData: {
				signal: this._rawLocalDescription,
                toUser: this._user,
                fileModel: this._fileModel,
                remotePeerId: this._id,
                propseId
			}
		}, SOCKET_EVENTS.MESSAGE);
	}
	
	// signal answer back
    _signalAnswerBack() {
        console.log('Signal answer back'); 
        SocketService.getInstance().send({
			type: SOCKET_MESSAGE_TYPES.PEER_SIGNAL_ANSWER,
			peerData: {
				signal: this._rawLocalDescription,
                user: this._user,
                fileModel: this._fileModel.getTransportData(),
                remotePeerId: this._id,
                originalCallFromId: this._remotePeerId
			}
		}, SOCKET_EVENTS.MESSAGE);
	}

	// send ice coandidate to other
	// _sendIceCandidate(candidate, remoteId) {
    //     console.log('Signal candidate 222', console.log(remoteId));
    //     return;            
	// 	if (candidate) {
	// 		SocketService.getInstance().send({
	// 			type: SOCKET_MESSAGE_TYPES.PEER_SIGNAL_ICE,
	// 			peerData: {
	// 				candidate,
	// 				user: this._user
	// 			}
	// 		}, SOCKET_EVENTS.MESSAGE);			
	// 	}
	// }

	// send 
    send(data) {
        if (this._dataChanel && this.readyState) {
            this._dataChanel.send(data);
        }
    }

	// send file
    sendFile(binaryData) {
        if (this._dataChanel && this.readyState) {
			console.log('Peer send chunk ...');
			this._dataChanel.send(binaryData);
        }
	}
	
    set readyState(val) {
        this._readyState = val;
    }

    get readyState() {
        return this._readyState;
	}
	
    get user() {
        return this._user;
    }

    // close connection / free memory
    disconnect() {
        if (!_.isNil(this._dataChanel)) {
            this._dataChanel.close();
        }
        if (!_.isNil(this._receiveChanel)) {
            this._receiveChanel.close();
        }
        if (!_.isNil(this._pc)) {
            this._pc.close();
        }	
        try {
            this._pc = null;
        } catch (e) {};
	}
	
    // override
    onOfferCreated(desc) {}
    // override
    onAnswerCreated(desc) {}
    // override
	onIceCandidate(candifate, remotePeerId) {}
	// override
	onClose(p) {}

	static isRtcSupported() {
        return DetectRTC.isWebRTCSupported;
	}

}
export default CustomPeer;
