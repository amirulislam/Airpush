import { AUTHENTICATED, LOG_OUT } from '../actions/Types';

export default (state = false, action) => {
    switch (action.type) {
        case AUTHENTICATED:
            return action.payload;
            break;
        case LOG_OUT:
            return false;            
            break;
        default:
            return state;
    }
}