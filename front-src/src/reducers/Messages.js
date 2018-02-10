import { MESSAGE, REMOVE_GROUP_MESSAGES, REMOVE_INTERNAL_MESSAGE, 
MESSAGE_DOWNLOAD_PROGRESS, ALTER_MESSAGE_PAYLOAD } from '../actions/Types';
import { SOCKET_MESSAGE_TYPES } from '../config';

import _ from 'lodash';

export default (state = [], action) => {
    switch (action.type) {
        case MESSAGE:
            return [...state, action.payload];
            break;
        case REMOVE_INTERNAL_MESSAGE:
            let messagesClone = _.cloneDeep(state);
            for (let i = 0; i < messagesClone.length; i++) {
                if(messagesClone[i]._id === action.payload) {
                    messagesClone.splice(i, 1);
                }
            } 
            return messagesClone;
            break;             
        case REMOVE_GROUP_MESSAGES:
            return [];
            break;
        case MESSAGE_DOWNLOAD_PROGRESS:
                return state.map(m => {                
                    if (m.type === SOCKET_MESSAGE_TYPES.ACCEPT_FILE_MESSAGE) {
                        if (m.payload._id === action.payload.messageId) {
                            m.payload.downloadProgress = action.payload.progress;
                        }                    
                    }
                    return m;
                })
            break;
            case ALTER_MESSAGE_PAYLOAD:
                return state.map(m => {                
                    if (m.type === SOCKET_MESSAGE_TYPES.ACCEPT_FILE_MESSAGE) {
                        if (m.payload._id === action.payload.messageId) {
                            const keys = Object.keys(action.payload.data);
                            for (const iterator of keys) {
                                m.payload[iterator] = action.payload.data[iterator];
                            }
                        }                    
                    }
                    return m;
                })
            break;                        
        default:
            return state;
    }
}