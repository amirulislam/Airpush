import { MENU_OPEN } from '../actions/Types';

export default (state = true, action) => {
    switch (action.type) {
        case MENU_OPEN:
            return action.payload;
            break;
        default:
            return state;
    }
}
