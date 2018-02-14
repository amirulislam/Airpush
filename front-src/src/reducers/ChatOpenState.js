import { MESSENGER_RIGHT_CHANGE_STATE } from '../actions/Types';

export default (state = true, action) => {
    switch (action.type) {
        case MESSENGER_RIGHT_CHANGE_STATE:
            return state ? false: true;
            break;
        default:
            return state;
    }
}