import { OPEN_INFO_ALERT, ALERT_MESSAGE } from '../actions/Types';

export default (state = false, action) => {
    switch (action.type) {
        case OPEN_INFO_ALERT:
            return action.payload;
            break;
        case ALERT_MESSAGE:
            return action.payload;
            break;            
        default:
            return state;
    }
}
