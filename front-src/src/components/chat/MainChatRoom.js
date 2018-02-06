import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import safe from 'undefsafe';

import ChatControllsLeft from './ChatControllsLeft';
import UsersRightSide from './UsersRightSide';
import ChatBottomActions from './ChatBottomActions';
import ChatMessenger from './ChatMessenger';
import SocketService from '../../services/SocketService';
import User from '../../models/User';
import TextMessage from '../../models/TextMessage';
import { SOCKET_EVENTS } from '../../config';

class MainChatRoom extends Component {

    static defaultProps = {
        authenticated: false
    }

    constructor(props) {
        super(props);
        this._sendMessage = this._sendMessage.bind(this);
    }

    _sendMessage(message) {
        console.log('Send message', message);
        if (message === '') { return; }
        if (!this.props.authenticated) {
            return;
        }
        const user = new User(this.props.authenticated);
        const messageModel = new TextMessage(user, message);

        SocketService.getInstance().send(messageModel, SOCKET_EVENTS.MESSAGE);
    }

    render() {
        return [
            <ChatControllsLeft key="chat-controlls-left" />,
            <UsersRightSide key="right-side-users-panel" />,
            <ChatMessenger key="msg-key" />,
            <ChatBottomActions onEnter={this._sendMessage} key="chat-bottom-actions" />
        ];
    }
}

const mapStateToProps = ({ authenticated }, ownProps) => {
    return {
        authenticated
    }
}

MainChatRoom.propTypes = {
    authenticated: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.object
    ])
}
 

export default connect(mapStateToProps, null)(MainChatRoom);
