import React, { Component } from 'react';
import { connect } from 'react-redux';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/link';
import ContentPowerOff from 'material-ui/svg-icons/action/power-settings-new';
import BaseAlert from '../modals/BaseAlert';
import { leaveRoom } from '../../actions';

class ChatControllsLeft extends Component {

    leaveChatRoom() {
        if (this.alert) {
            this.alert.open([
                <p key="conf">Are you sure you want to leave this chat room?</p>
            ]);
        }
    }

    render(){
        return(
            <div className="chat-left-controlls">
                <FloatingActionButton mini={false} style={{display: 'block', marginBottom: '15px'}}>
                    <ContentAdd />
                </FloatingActionButton>
                <FloatingActionButton onClick={e => this.leaveChatRoom()} mini={true} secondary={true} style={{
                    marginLeft: '8px'
                }} iconStyle={{ backgroundColor: '#CCCCCC' }}>
                    <ContentPowerOff />
                </FloatingActionButton>
                <BaseAlert maxWidth={350} ref={ r => this.alert = r } onCancel={() => {}} onAccept={() => this.props.leaveRoom()} />              
            </div>
        )
    }
}

export default connect(null, { leaveRoom })(ChatControllsLeft);
