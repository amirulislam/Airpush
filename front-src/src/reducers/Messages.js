import { MESSAGE } from '../actions/Types';
export default (state = [], action) => {
    switch (action.type) {
        case MESSAGE:
            return [...state, action.payload];
        default:
            return state;
    }
}