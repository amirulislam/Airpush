import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import SingIn from './SignIn';
import { ROUTES } from '../config';
import ChatRoom from './chat/ChatRoom';

class Main extends Component {
    render() {
        return(
            <Switch>
                <Route path={`${ROUTES.SIGN_IN}*`} component={ SingIn } />
                <Route path={`${ROUTES.CHAT_ROOM}*`} component={ ChatRoom } />
                <Route render={() => <p>Not found</p>} />
            </Switch>
        );
    }
}

export default Main;
