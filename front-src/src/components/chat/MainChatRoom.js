import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import safe from 'undefsafe';

// import ChatControllsLeft from './ChatControllsLeft';
// import UsersRightSide from './UsersRightSide';
import ChatBottomActions from './ChatBottomActions';
import ChatMessenger from './ChatMessenger';
import SocketService from '../../services/SocketService';
import User from '../../models/User';
import TextMessage from '../../models/TextMessage';

class MainChatRoom extends Component {

    static defaultProps = {
        authenticated: false,
        chatOpenState: true
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

    _renderSizeCSS() {
        if (this.props.chatOpenState) {
            return 'chat-group-main-messenger open pull-right';
        } else {
            return 'chat-group-main-messenger close pull-right';
        }
    }

    render() {
        return(
            <div className={ this._renderSizeCSS() }>
                <ChatMessenger />
                <ChatBottomActions onEnter={this._sendMessage} key="chat-bottom-actions" />
            </div>            
        )
        // return [
        //     <ChatControllsLeft key="chat-controlls-left" />,
        //     <ChatMessenger key="msg-key" />,
        //     <ChatBottomActions onEnter={this._sendMessage} key="chat-bottom-actions" />
        // ];
    }
}

const mapStateToProps = ({ authenticated, chatOpenState }, ownProps) => {
    return {
        authenticated, chatOpenState
    }
}

MainChatRoom.propTypes = {
    authenticated: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.object
    ]),
    chatOpenState: PropTypes.bool
}
 

export default connect(mapStateToProps, null)(MainChatRoom);
