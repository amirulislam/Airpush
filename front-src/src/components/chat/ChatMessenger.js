import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Utils from '../../utils';
import { SOCKET_MESSAGE_TYPES } from '../../config';
import UserActivityInfo from './beans/UserActivityInfo';


class ChatMessenger extends Component {
    static defaultProps = {
        messages: []
    }

    componentWillReceiveProps(nextProps) {
        
    }

    _renderMessage(m) {
        if (!m || !m.msgType) {
            return <noscript key={Utils.uid()} />;
        }
        switch(m.msgType) {
            case SOCKET_MESSAGE_TYPES.NEW_USER_JOINED:
                return <UserActivityInfo message={m} key={Utils.uid()} txt={`joined the group`} />          
            break;
            case SOCKET_MESSAGE_TYPES.USER_LEAVED:
                return <UserActivityInfo message={m} key={Utils.uid()} txt={`left the group`} />          
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
            <div className="chat-messenger">
                <div className="messages-content">
                    { this._renderMessages() }
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ messages }, ownProps) => {
    return {
        messages
    }
}

ChatMessenger.propTypes = {
    messages: PropTypes.array
}

export default connect(mapStateToProps, null)(ChatMessenger);
