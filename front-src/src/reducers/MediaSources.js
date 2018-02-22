import { MEDIA_SOURCE_ADDED, REMOVE_SINGLE_MEDIA_SOURCE, 
REMOVE_MEDIA_SOURCES, MAXIMIZE_MEDIA_SOURCE, UPDATE_MEDIA_SOURCE,
CREATE_OR_UPDATE_MEDIA_SOURCE } from '../actions/Types';
    
import _ from 'lodash';
    
export default (state = [], action) => {
    switch (action.type) {
        case MEDIA_SOURCE_ADDED:
            return [...state, action.payload];
            break;

        case REMOVE_SINGLE_MEDIA_SOURCE:
            let clone = _.cloneDeep(state);
            let wasOpened = false;
            for (let i = 0; i < clone.length; i++) {
                if(clone[i].peerId === action.payload) {
                    if (clone[i].isOpen === true) {
                        wasOpened = true;
                    }
                    clone.splice(i, 1);
                }
            } 
            if (wasOpened === true) {
                for (let j = 0; j < clone.length; j++) {
                    if(clone[j].peerId === 'me') {
                        clone[j].isOpen = true;
                        break;
                    }
                }
            }
            return clone;
            break;

        case MAXIMIZE_MEDIA_SOURCE:
            let cloneed = _.cloneDeep(state);
            for (let i = 0; i < cloneed.length; i++) {
                if(cloneed[i].peerId === action.payload) {
                    cloneed[i].isOpen = true;
                } else {
                    cloneed[i].isOpen = false;
                }
            } 
            return cloneed;
            break;

        case REMOVE_MEDIA_SOURCES:
            return [];
            break; 

        case UPDATE_MEDIA_SOURCE:
            let cl = _.cloneDeep(state);
            for (let i = 0; i < cl.length; i++) {
                if(cl[i].peerId === action.payload.peerId) {
                    cl[i].stream = action.payload.stream
                } 
            } 
            return cl;
            break;

            case CREATE_OR_UPDATE_MEDIA_SOURCE:
            let existingPeer = { exists: false, index: 0 };
            for (let i = 0; i < state.length; i++) {
                if (state[i].peerId === action.payload.peerId) {
                    existingPeer.exists = true;
                    existingPeer.index = i;
                    break;
                }
            }

            if (!existingPeer.exists) {
                return [...state, action.payload];
            }

            let createOrUpdate = _.cloneDeep(state);
            createOrUpdate[existingPeer.index] = action.payload;
            return createOrUpdate;
            break;                                                  
        default:
            return state;
    }
}