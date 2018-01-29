import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import SingIn from './SignIn';

class Main extends Component {
    render() {
        return(
            <Switch>
                <Route path="/app/signin*" component={ SingIn } />
                <Route path="/app/room" render={() => <p>room</p>} />
                <Route render={() => <p>Not found</p>} />
            </Switch>
        );
    }
}

export default Main;
