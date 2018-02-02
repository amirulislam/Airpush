import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom'
import queryString from 'query-string';
import { ROUTES } from '../config';

class RootSection extends PureComponent {

    render() {
        const parsed = queryString.parse(this.props.location.search);   
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
