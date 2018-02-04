import { JOINED_ROOM, LEAVED_ROOM } from '../actions/Types';
export default (state = false, action) => {
    switch (action.type) {
        case JOINED_ROOM:
            return action.payload;
            break;
        case LEAVED_ROOM:
            return false;            
            break;
        default:
            return state;
    }
}
