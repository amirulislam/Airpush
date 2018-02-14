import { MEDIA_SOURCE_ADDED, REMOVE_SINGLE_MEDIA_SOURCE, REMOVE_MEDIA_SOURCES, MAXIMIZE_MEDIA_SOURCE } from '../actions/Types';
    
    import _ from 'lodash';
    
    export default (state = [], action) => {
        switch (action.type) {
            case MEDIA_SOURCE_ADDED:
                return [...state, action.payload];
                break;
            case REMOVE_SINGLE_MEDIA_SOURCE:
                let clone = _.cloneDeep(state);
                for (let i = 0; i < clone.length; i++) {
                    if(clone[i].peerId === action.payload) {
                        clone.splice(i, 1);
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
            default:
                return state;
        }
    }