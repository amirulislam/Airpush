import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import safe from 'undefsafe';

import IconButton from 'material-ui/IconButton';
import CreateRoom from './CreateRoom';
import ChatControllsLeft from './ChatControllsLeft';
import JoiningRoom from './JoiningRoom';
import UsersRightSide from './UsersRightSide';
import ChatBottomActions from './ChatBottomActions';

class ChatRoom extends Component {

    constructor(props) {
        super(props);
        this.state = { isJoiningRoom: false };
    }

    static defaultProps = {
        roomId: false
    }

    componentWillReceiveProps(nextProps) {
        const joinRoom = safe(this.props, 'location.state.joinRoom');
        if (!_.isNil(joinRoom) && nextProps.roomId != this.props.roomId) {
            delete this.props.location.state.joinRoom;
        }
    }

    _sendMessage(message) {
        console.log('Send message', message);
    }

    _renderChatRoomBackground() {
        return (this.props.roomId) ? ' chat-room-background' : '';
    }

    _render() {
        if (!_.isNil(safe(this.props, 'location.state.joinRoom'))) {
            return <JoiningRoom roomToJoin={this.props.location.state.joinRoom} />
        } 
        if (this.props.roomId) {
            return [
                <ChatControllsLeft key="chat-controlls-left" />,
                <UsersRightSide key="right-side-users-panel" />,
                <ChatBottomActions onEnter={this._sendMessage} key="chat-bottom-actions" />
            ]
        } else {
            return <CreateRoom />;
        }        
    }

    render() {
        return(
            <div className={ `section-content-ui chat-section${this._renderChatRoomBackground()}` }>
                { this._render() }
            </div>
        )
    }
}

const mapStateToProps = ({ roomId }, ownProps) => {
    return {
        roomId
    }
}

ChatRoom.propTypes = {
    roomId: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
    ]),    
}

export default connect(mapStateToProps)(ChatRoom);
