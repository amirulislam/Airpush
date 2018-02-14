import _ from 'lodash';
import debug from '../../utils/debug';
import safe from 'undefsafe';

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
                video: {
                    // width: { ideal: 640, max: 640 },
                    // height: { ideal: 480, max: 480 }                    
                    width: { ideal: 400, max: 400 },
                    height: { ideal: 300, max: 300 }
                }
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
