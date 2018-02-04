import { MESSAGE, REMOVE_GROUP_MESSAGES } from '../actions/Types';
export default (state = [], action) => {
    switch (action.type) {
        case MESSAGE:
            return [...state, action.payload];
            break;
        case REMOVE_GROUP_MESSAGES:
            return [];
            break;            
        default:
            return state;
    }
}