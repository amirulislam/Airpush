import _ from 'lodash';
import { EVENTS_EXT } from '../screen-sharing/ScreenSharingService';
import ScreenSharingService from '../screen-sharing/ScreenSharingService';
import { SCREEN_RESOLUTION } from '../../config';
import MediaManager from '../media/MediaManager';

class ScreenMediaUtils {
    constructor() {

    }

    // is extension available
    isAirpushExtensionInstalled() {
        return new Promise((resolve, reject) => {
            let isExtension = false;
            const callback = event => {
                isExtension = true;
                ScreenSharingService.getInstance().removeEvent(EVENTS_EXT.SIGNAL_PRESENCE, callback);
                resolve();
            }
            ScreenSharingService.getInstance().addListener(EVENTS_EXT.SIGNAL_PRESENCE, callback);
            setTimeout(() => {
                if (!isExtension) {
                    reject();
                }
            }, 1000);
            ScreenSharingService.getInstance().extensionExists();
        });        
    }

    // get screen stream
    getScreenStream() {
        return new Promise((resolve, reject) => {
            const removeListeners = () => {
                ScreenSharingService.getInstance().removeEvent(EVENTS_EXT.SOURCE_AQUIRED, aquired);
                ScreenSharingService.getInstance().removeEvent(EVENTS_EXT.ACCESS_DENIED, denied);
            }
            const aquired = data => {
                removeListeners();
                resolve(data);
            }
            const denied = err => {
                removeListeners();
                reject(err);
            }
            ScreenSharingService.getInstance().addListener(EVENTS_EXT.SOURCE_AQUIRED, aquired);
            ScreenSharingService.getInstance().addListener(EVENTS_EXT.ACCESS_DENIED, denied);
            ScreenSharingService.getInstance().requestSourceId();
        });
    }

    // get stram
    getUserMedia({ sourceId }) {
        return navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: sourceId,
                    minWidth: SCREEN_RESOLUTION.minWidth,
                    maxWidth: SCREEN_RESOLUTION.maxWidth,
                    minHeight: SCREEN_RESOLUTION.minHeight,
                    maxHeight: SCREEN_RESOLUTION.maxHeight					
                }
            }
        })
        .then(stream => {
            const tracks  = stream.getTracks();
            let track = false;
            if (_.isArray(tracks)) {
                for (let i = 0; i < tracks.length; i++) {
                    if (tracks[i].kind.toString().indexOf('video') != -1) {
                        track = tracks[i];
                        break;
                    }
                }
            }
            if (track) {
                MediaManager.getInstance().setDesktopStream(track);
            }
            // stream.getTracks().forEach(track => {
            //     console.log('TRACK', track);
            //     track.onended = () => { console.log('ON TRACK ENDED') }
            // })
        })
        .catch(err => {
            console.log('ERROR', err);
        });
    }
}

export default ScreenMediaUtils;
