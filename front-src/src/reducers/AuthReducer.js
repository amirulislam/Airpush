import { AUTHENTICATED, LOG_OUT } from '../actions/Types';

export default (state = false, action) => {
    switch (action.type) {
        case AUTHENTICATED:
            return action.payload;
        case LOG_OUT:
            return false;            
        default:
            return state;
    }
}