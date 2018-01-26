import { AUTHENTICATED } from '../actions/Types';

export default (state = false, action) => {
    switch (action.type) {
        case AUTHENTICATED:
            return action.payload;
        default:
            return state;
    }
}