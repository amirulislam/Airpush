import { JOINED_ROOM_ID } from '../actions/Types';
export default (state = false, action) => {
    switch (action.type) {
        case JOINED_ROOM_ID:
            return action.payload; 
            break;     
        default:
            return state;
    }
}