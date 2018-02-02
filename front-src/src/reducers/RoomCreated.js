import { ROOM_CREATED_NOW } from '../actions/Types';
export default (state = false, action) => {
    switch (action.type) {
        case ROOM_CREATED_NOW:
            return action.payload;      
        default:
            return state;
    }
}

