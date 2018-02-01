import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { createChatRoom } from '../../actions';
import RaisedButton from 'material-ui/RaisedButton';
import ChatIcon from 'material-ui/svg-icons/communication/chat-bubble-outline';

class CreateRoom extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isCreatingRoom: false
        }
    }

    createRoom() {
        if (this.state.isCreatingRoom) {
            return;
        }
        this.setState({ isCreatingRoom: true });
        this.props.createChatRoom(() => {
            console.log('Room created');
            this.setState({ isCreatingRoom: false });
        });
    }

    render() {
        return(
            <div className="create-chatroom">
                <ChatIcon style={{ color: '#CCCCCC', width: 40, height: 40, marginBottom: '15px' }} />
                <div style={{marginBottom: '19px'}}><RaisedButton onClick={ e => this.createRoom() } label="Create chat room" primary={true} /></div>
                <p>Create a new chat room &amp; invite your friends.</p>
            </div>  
        );
    }
}

export default connect(null, { createChatRoom })(CreateRoom);
