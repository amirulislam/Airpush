import { combineReducers } from 'redux';

import AuthReducer from './AuthReducer';
import MenuReducer from './MenuReducer';

const rootReducers = combineReducers({
    authenticated: AuthReducer,
    menuOpen: MenuReducer
});

export default rootReducers;

