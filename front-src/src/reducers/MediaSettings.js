import { USER_MEDIA_SETTINGS } from '../actions/Types';
export default (state = {}, action) => {
    switch (action.type) {
        case USER_MEDIA_SETTINGS:
            return action.payload; 
            break;     
        default:
            return state;
    }
}