import { OPEN_CLOSE_FULL_SCREEN } from '../actions/Types';
export default (state = false, action) => {
    switch (action.type) {
        case OPEN_CLOSE_FULL_SCREEN:
            return action.payload; 
            break;     
        default:
            return state;
    }
}