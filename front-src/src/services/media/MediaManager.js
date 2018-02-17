import _ from 'lodash';
import debug from '../../utils/debug';
import safe from 'undefsafe';
import { VIDEO_RESOLUTION } from '../../config';

let instance;

class MediaManager {

    _localStream;
    
    constructor() {
        if (instance) {
            throw new Error('Can not instantiate like this');
        }
    }

    getUserMedia() {
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
                resolve(stream);
            })
            .catch(err => {
                reject(err);
            })            
        });
    }

    toggleVideo(videoEnabled) {
        this._localStream.getTracks().forEach(track => {
            if (track && track.kind && track.kind === 'video' && track.enabled != videoEnabled) {
                track.enabled = videoEnabled;
            }
        });
    }

    toggleAudio(audioEnabled) {
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

    static getInstance() {
        if (!instance) {
            instance = new MediaManager();
        }
        return instance;
    }
}

export default MediaManager;
