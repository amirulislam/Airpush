import { combineReducers } from 'redux';

import AuthReducer from './AuthReducer';

const rootReducers = combineReducers({
    authenticated: AuthReducer
});

export default rootReducers;

