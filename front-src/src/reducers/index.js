import { combineReducers } from 'redux';

import AuthReducer from './AuthReducer';
import MenuReducer from './MenuReducer';
import RoomReducer from './RoomReducer';
import NotificationReducer from './NotificationReducer';

const rootReducers = combineReducers({
    authenticated: AuthReducer,
    menuOpen: MenuReducer,
    roomId: RoomReducer,
    notification: NotificationReducer
});

export default rootReducers;

