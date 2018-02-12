import React, { Component } from 'react';
import { connect } from 'react-redux';
import MainBottomControlls from './MainBottomControlls';

class ChatMainView extends Component {
    render() {
        return(
            <div className="chat-group-full-ui pull-left">
                <MainBottomControlls />
            </div>            
        )
    }
}

export default ChatMainView;