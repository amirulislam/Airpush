import { NEW_USER_JOIN, USER_LEFT } from '../actions/Types';
export default (state = [], action) => {
    switch (action.type) {
        case NEW_USER_JOIN:
            return [action.payload, ...state];
        case USER_LEFT:
            console.log('Substract user');
            return [];
        default:
            return state;
    }
}