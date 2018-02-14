import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { leaveRoom, roomCreatedFirstTime, sendNotificationFromComponent } from '../../actions';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/link';
import ContentPowerOff from 'material-ui/svg-icons/action/power-settings-new';
import BaseAlert from '../modals/BaseAlert';
import InviteModal from '../modals/InviteModal';
// import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {CopyToClipboard} from 'react-copy-to-clipboard';

class ChatControllsLeft extends Component {

    constructor(props) {
        super(props);
        this.state = { value: '', copied: false }
    }

    static defaultProps = {
        roomId: '',
        roomJustCreated: false
    }

    componentDidMount() {
        this.setState({ value: `${window.location.protocol}//${window.location.host}/app?r=${this.props.roomId}` });
    }

    componentWillReceiveProps(newProps) {
        this.setState({ value: `${window.location.protocol}//${window.location.host}/app?r=${this.props.roomId}` });
        if (newProps.roomJustCreated) {
            setTimeout(() => {
                this.inviteOthers();
            }, 1000);
            roomCreatedFirstTime(false);
        }
    }    

    leaveChatRoom() {
        if (this.alert) {
            this.alert.open([
                <p key="conf">Are you sure you want to leave this chat room?</p>
            ]);
        }
    }

    handleCopy() {
        this.setState({copied: true});
        console.log('Copied', this.state.value);
        if (this.invite) { this.invite.close() };
    }

    inviteOnClose() {
        this.props.sendNotificationFromComponent('Link copied!', 2000);
    }

    inviteOthers() {
        if (this.invite) {
            this.invite.open([
                <p key="invite-txt">Invite others to this chat group. Copy the link below &amp; send it to your friends.</p>,
                <div key="share-link" className="share-link">
                    <div className="room-share-url noselect pull-left">
                        {`${window.location.protocol}//${window.location.host}/app?r=${this.props.roomId}`}
                    </div>
                    <div className="pull-left">
                        <CopyToClipboard text={this.state.value}
                            onCopy={() => { this.handleCopy() }}>
                            <RaisedButton label="Copy Link" primary={true} />
                        </CopyToClipboard>
                    </div>

                    <div className="clearfix"></div>
                </div>
            ]);
        }        
    }

    render(){
        return(
            <div className="chat-left-controlls">
                <FloatingActionButton onClick={ e => this.inviteOthers() } mini={false} style={{display: 'block', marginBottom: '15px'}}>
                    <ContentAdd />
                </FloatingActionButton>
                <FloatingActionButton onClick={e => this.leaveChatRoom()} mini={true} secondary={true} style={{
                    marginLeft: '7px'
                }} iconStyle={{ backgroundColor: '#CCCCCC' }}>
                    <ContentPowerOff />
                </FloatingActionButton>
                <BaseAlert maxWidth={350} ref={ r => this.alert = r } onCancel={() => {}} onAccept={() => this.props.leaveRoom()} />
                <InviteModal onCancel={() => {this.inviteOnClose()}} hideCancelButton={true} maxWidth={500} ref={ r => this.invite = r } />
            </div>
        )
    }
}

const mapStateToProps = ({ roomId, roomJustCreated }, ownProps) => {
    return {
        roomId, roomJustCreated
    }
}

ChatControllsLeft.propTypes = {
    roomId: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
    ]),
    roomJustCreated: PropTypes.bool
}

export default connect(mapStateToProps, { leaveRoom, roomCreatedFirstTime, sendNotificationFromComponent })(ChatControllsLeft);
