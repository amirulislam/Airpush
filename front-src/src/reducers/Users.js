import { NEW_USER_JOIN, USER_LEFT } from '../actions/Types';
export default (state = [], action) => {
    switch (action.type) {
        case NEW_USER_JOIN:
            return [action.payload, ...state];
        case USER_LEFT:
            let usersClone = _.cloneDeep(state);
            for (let i = 0; i < usersClone.length; i++) {
                if(usersClone[i]._id === action.payload._id) {
                    usersClone.splice(i, 1);
                }
            }
            return usersClone;
        default:
            return state;
    }
}