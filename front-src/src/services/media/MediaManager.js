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
                reject({});
            })            
        });
    }

    static getInstance() {
        if (!instance) {
            instance = new MediaManager();
        }
        return instance;
    }
}

export default MediaManager;
