import { MESSAGE, REMOVE_GROUP_MESSAGES, REMOVE_INTERNAL_MESSAGE } from '../actions/Types';
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
        default:
            return state;
    }
}