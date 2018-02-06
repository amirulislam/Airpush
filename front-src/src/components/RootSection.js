import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { ROUTES } from '../config';
import queryString from 'query-string';
import { joinRoomNow } from '../actions';
import StorageUtils from '../utils/Storage';

class RootSection extends PureComponent {

    render() {
        
        const roomId = StorageUtils.getJoinedRoom();

        let param = '';
        if (roomId) {
            param = `/${roomId}`;
        }

        return <Redirect to={{
            pathname: ROUTES.CHAT_ROOM + param
        }} />  
    }
}

export default RootSection;
