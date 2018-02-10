import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';

import SingIn from './SignIn';
import { ROUTES } from '../config';
import ChatRoom from './chat/ChatRoom';
import MyAccount from './account/MyAccount';
import Notifications from '../components/notifications/Notifications';
import RootSection from './RootSection';

import StorageUtils from '../utils/Storage';
import SocketService from '../services/SocketService';
import queryString from 'query-string';


class Main extends Component {

    // static defaultProps = {
    //     authenticated: false
    // }

    constructor(props) {
        super(props);
        if (StorageUtils.getUser()) {
            SocketService.getInstance().connect();
        } else {
            SocketService.getInstance().disconnect();
        }        
    }

    render() {
        return(
            <div className="app-section-content">
                <Switch>
                    <Route path={`${ROUTES.SIGN_IN}*`} component={ SingIn } />
                    <Route path={`${ROUTES.CHAT_ROOM}/:route_id`} component={ ChatRoom } />
                    <Route path={`${ROUTES.CHAT_ROOM}`} component={ ChatRoom } />
                    <Route path={`${ROUTES.MY_ACCOUNT}`} component={ MyAccount } />
                    <Route path={`${ROUTES.ROOT}`} component={ RootSection } />
                    <Route render={() => <p>Not found</p>} />
                </Switch>
                <Notifications />                
            </div>
        );
    }
}

// Main.propTypes = {
//     authenticated: PropTypes.oneOfType([
//         PropTypes.bool,
//         PropTypes.object
//     ]),
// }

// const mapStateToProps = ({ authenticated }, ownProps) => {
//     return {
//         authenticated
//     }
// }

export default Main;
