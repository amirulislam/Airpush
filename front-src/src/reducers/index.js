import { combineReducers } from 'redux';

import AuthReducer from './AuthReducer';
import MenuReducer from './MenuReducer';
import RoomReducer from './RoomReducer';
import NotificationReducer from './NotificationReducer';
import RoomCreated from './RoomCreated';
import Users from './Users';
import Messages from './Messages';

const rootReducers = combineReducers({
    authenticated: AuthReducer,
    menuOpen: MenuReducer,
    roomId: RoomReducer,
    notification: NotificationReducer,
    roomJustCreated: RoomCreated,
    users: Users,
    messages: Messages
});

export default rootReducers;

