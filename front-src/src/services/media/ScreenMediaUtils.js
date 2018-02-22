import _ from 'lodash';
import { EVENTS_EXT } from '../screen-sharing/ScreenSharingService';
import ScreenSharingService from '../screen-sharing/ScreenSharingService';
import { SCREEN_RESOLUTION } from '../../config';
import MediaManager from '../media/MediaManager';
import { updateMediaSource } from '../../actions';

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
            MediaManager.getInstance().setDesktopStream(stream);
            updateMediaSource({
                peerId: 'me',
                stream
            })
            return;
        })
        .catch(err => {
            console.log('ERROR', err);
        });
    }
}

export default ScreenMediaUtils;
