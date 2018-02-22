import _ from 'lodash';
import debug from '../../utils/debug';
import safe from 'undefsafe';
import { VIDEO_RESOLUTION } from '../../config';
import StorageUtils from '../../utils/Storage';
import { updateMediaSource } from '../../actions';
import PeerService from '../peer-advanced/PeerService';

let instance;

class MediaManager {

    _localStream;
    _desktopStream;
    _desktopTrack;
    _audioTrack;
    
    constructor() {
        if (instance) {
            throw new Error('Can not instantiate like this');
        }
    }

    // set desktop stream
    setDesktopStream(desktopStream) {
        this._desktopStream = desktopStream;
        this._desktopTrack = this.getDesktopTrack();
    }

    getUserMedia() {
        if (this._desktopStream) {
            return Promise.resolve(this._desktopStream);
        }
        if (this._localStream) {
            return Promise.resolve(this._localStream);
        }
        return new Promise((resolve, reject) => {
            navigator.mediaDevices.getUserMedia({
                audio: true,
                video: VIDEO_RESOLUTION.medium
            })
            .then(stream => {
                this._localStream = stream;
                this._checkMediaSettingsFirstTime();
                resolve(stream);
            })
            .catch(err => {
                reject(err);
            })            
        });
    }

    _checkMediaSettingsFirstTime() {
        if (this._localStream) {
            const userMediaSettings = StorageUtils.getUserMediaSettings();
            this._localStream.getTracks().forEach(track => {
                if (userMediaSettings) {
                    if (track && track.kind && track.kind === 'video') {
                        track.enabled = userMediaSettings.camState;
                    }
                    if (track && track.kind && track.kind === 'audio') {
                        track.enabled = userMediaSettings.micState;
                        this._audioTrack = track;
                    }
                }
            });
        }
    }

    toggleVideo(videoEnabled) {
        if (this._desktopTrack) {
            try {
                this._desktopTrack.enabled = videoEnabled;
            } catch (e) {}
            return;
        }
        if (!this._localStream) {
            return;
        }        
        this._localStream.getTracks().forEach(track => {
            if (track && track.kind && track.kind === 'video' && track.enabled != videoEnabled) {
                track.enabled = videoEnabled;
            }
        });
    }

    toggleAudio(audioEnabled) {
        if (!this._localStream) {
            return;
        }          
        this._localStream.getTracks().forEach(track => {
            if (track && track.kind && track.kind === 'audio' && track.enabled != audioEnabled) {
                track.enabled = audioEnabled;
            }
        });
    }    

    get localStream() {
        return this._localStream;
    }

    hasLocalStream() {
        return this._localStream ? true : false;
    }

    getAudioTrack() {
        return this._audioTrack;
    }

    getDesktopStream() {
        if (!this._desktopStream) {
            return;
        }
        return this._desktopStream;      
    }
    getDesktopTrack() {
        if (!this._desktopStream) {
            return;
        }
        if (this._desktopTrack) {
            return this._desktopTrack;
        }
        let trackData = false;
        this._desktopStream.getTracks().forEach(track => {
            if (track) {
                trackData = track;
            }
        });
        return trackData;                
    }

    endScreenShare() {
        this.removeDesktopStream();
        this.getUserMedia()
        .then(stream => {
            updateMediaSource({
                peerId: 'me',
                stream
            });
            PeerService.getInstance().renegociateVideo();
        })
        .catch(err => {
            console.log('Err', err);
        })       
    }

    removeLocalStream() {
        try {
            this.removeDesktopStream();
        } catch (e) {}
        if (!this._localStream) {
            return;
        }        
        this._localStream.getTracks().forEach(track => {
            if (track) {
                try {
                    track.stop();
                } catch (e) {}
            }
        });
        try {
            delete this._localStream;
            delete this._audioTrack;
        } catch (e) {}
    }

    removeDesktopStream() {
        if (!this._desktopStream) {
            return;
        }        
        this._desktopStream.getTracks().forEach(track => {
            if (track) {
                try {
                    track.stop();
                } catch (e) {}
            }
        });
        try {
            delete this._desktopStream;
            delete this._desktopTrack;
        } catch (e) {}
    }    

    static getInstance() {
        if (!instance) {
            instance = new MediaManager();
        }
        return instance;
    }
}

export default MediaManager;
