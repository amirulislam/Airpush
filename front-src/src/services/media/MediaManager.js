import _ from 'lodash';
import debug from '../../utils/debug';
import safe from 'undefsafe';
import { VIDEO_RESOLUTION } from '../../config';
import StorageUtils from '../../utils/Storage';

let instance;

class MediaManager {

    _localStream;
    _desktopStream;
    
    constructor() {
        if (instance) {
            throw new Error('Can not instantiate like this');
        }
    }

    // set desktop stream
    setDesktopStream(desktopStream) {
        this._desktopStream = desktopStream;
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
                    }
                }
            });
        }
    }

    toggleVideo(videoEnabled) {
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

    removeLocalStream() {
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
