import { OPEN_NOTIFICATION, CLOSE_NOTIFICATION } from '../actions/Types';

export default (state = false, action) => {
    switch (action.type) {
        case OPEN_NOTIFICATION:
            return action.payload;
            break;
        case CLOSE_NOTIFICATION:
            return false;
            break;
        default:
            return state;
    }
}
