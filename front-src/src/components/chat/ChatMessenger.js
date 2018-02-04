import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Utils from '../../utils';
import { SOCKET_MESSAGE_TYPES } from '../../config';
import UserActivityInfo from './beans/UserActivityInfo';
import UserMessage from './beans/UserMessage';
import _ from 'lodash';


class ChatMessenger extends Component {
    static defaultProps = {
        messages: [],
        authenticated: false
    }

    test = 'xxxxx';
    messangerUI;

    constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        this.messangerUI.scrollTop = this.messangerUI.scrollHeight;
    }

    componentDidMount() {
        console.log('AICI !!!!', this.messangerUI)
    }

    _renderMessage(m) {
        console.log('RENDER MESSAGE now', m);
        // console.log('USER_ID', this.props.authenticated);
        if (!m || !m.type) {
            return <noscript key={Utils.uid()} />;
        }

        switch(m.type) {
            case SOCKET_MESSAGE_TYPES.NEW_USER_JOINED:
                return <UserActivityInfo message={m} key={Utils.uid()} txt={`joined the group`} />          
            break;
            case SOCKET_MESSAGE_TYPES.USER_LEAVED:
                return <UserActivityInfo message={m} key={Utils.uid()} txt={`left the group`} />          
            break;
            case SOCKET_MESSAGE_TYPES.TEXT_MESSAGE:
                return <UserMessage message={m} key={Utils.uid()} />
            break;       
        }
        return <noscript key={Utils.uid()} />;
    }

    _renderMessages() {
        return this.props.messages.map(m => {
            return this._renderMessage(m);
        });
    }

    render() {
        return(
            <div className="chat-messenger" ref={(r) => { this.messangerUI = r; }}>
                <div className="messages-content">
                    { this._renderMessages() }
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ messages, authenticated }, ownProps) => {
    return {
        messages, authenticated
    }
}

ChatMessenger.propTypes = {
    messages: PropTypes.array,
    authenticated: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.object
    ])    
}

export default connect(mapStateToProps, null)(ChatMessenger);
