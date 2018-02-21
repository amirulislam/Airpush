export const EVENTS_APP = {
    REQUEST_SIGNAL_PRESENCE: 'REQUEST_SIGNAL_PRESENCE',
    REQUEST_SOURCE_ID: 'REQUEST_SOURCE_ID'
}
export const EVENTS_EXT = {
    SIGNAL_PRESENCE: 'SIGNAL_PRESENCE',
    SOURCE_ID: 'SOURCE_ID',
    ACCESS_DENIED: 'ACCESS_DENIED',
    SOURCE_AQUIRED: 'SOURCE_AQUIRED'
}

let instance;
class ScreenSharingService {

    _listeners = [];

    constructor() {
        if (instance) {
            throw new Error('Can not instantiate like this');
        }        
        this._listenForMessages();
    }

    // check if extension exists
    extensionExists() {
        this.sendMessage({
            type: EVENTS_APP.REQUEST_SIGNAL_PRESENCE
        })
    }

    requestSourceId() {
        this.sendMessage({
            type: EVENTS_APP.REQUEST_SOURCE_ID
        })        
    }

    _listenForMessages() {
        window.addEventListener('message', (event) => {
            if (event && event.data) {
                switch(event.data.type) {
                    case EVENTS_EXT.SIGNAL_PRESENCE:
                        // console.log('GOT SIGNAL_PRESENCE');
                    break;
                }
                this._fireEvents(event.data.type, event.data);
            }
        });
    }

    // send message
    sendMessage(message) {
		window.postMessage(message, "*");
    }

    _fireEvents(evType, evData) {
        for (let i = 0; i < this._listeners.length; i++) {
            if (this._listeners[i].evType === evType && this._listeners[i].cb) {
                this._listeners[i].cb(evData);
            }
        }
    }

    // { evType, cb }
    addListener(evType, cb) {
        this._listeners.push({evType, cb});
    }

    removeEvent(evType, cb) {
        for (let i = 0; i < this._listeners.length; i++) {
            if (this._listeners[i].evType === evType && this._listeners[i].cb === cb) {
                this._listeners.splice(i, 1);
                break;
            }
        }
    }
    
    // remove all listeners
    removeAllListeners() {
        this._listeners = [];
    }

    test() {
        setTimeout(() => {
            this.extensionExists();
        }, 1000);
    }

    static getInstance() {
        if (!instance) {
            instance = new ScreenSharingService();
        }
        return instance;
    }    
}

export default ScreenSharingService;
