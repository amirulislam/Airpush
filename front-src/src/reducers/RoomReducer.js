import { JOINED_ROOM, LEAVED_ROOM } from '../actions/Types';
export default (state = false, action) => {
    switch (action.type) {
        case JOINED_ROOM:
            return action.payload;
        case LEAVED_ROOM:
            return false;            
        default:
            return state;
    }
}
