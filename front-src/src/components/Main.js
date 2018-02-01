import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SingIn from './SignIn';
import { ROUTES } from '../config';
import ChatRoom from './chat/ChatRoom';

class Main extends Component {

    static defaultProps = {
        authenticated: false
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        
    }

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

Main.propTypes = {
    authenticated: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.object
    ]),
}

const mapStateToProps = ({ authenticated }, ownProps) => {
    return {
        authenticated
    }
}

export default connect(mapStateToProps)(Main);
