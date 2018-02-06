import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom'
import { ROUTES } from '../config';
// import StorageUtils from '../utils/Storage';
import { joinRoomNow } from '../actions';

class RootSection extends PureComponent {

    render() {
        return <Redirect to={{
            pathname: ROUTES.CHAT_ROOM
        }} />  

        if (parsed.r && this.props.location.pathname != ROUTES.CHAT_ROOM) {
            return <Redirect to={{
                pathname: ROUTES.CHAT_ROOM,
                state: { joinRoom: parsed.r }
            }} />
        } else {
            return <Redirect to={{
                pathname: ROUTES.CHAT_ROOM
            }} />            
        }
    }
}

export default RootSection;
