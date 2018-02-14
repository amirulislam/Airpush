import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { leaveRoom, sendNotificationFromComponent, roomCreatedFirstTime } from '../../../actions';

import IconButton from 'material-ui/IconButton';
import MicOn from 'material-ui/svg-icons/av/mic';
import MicOff from 'material-ui/svg-icons/av/mic-off';
import VideoOn from 'material-ui/svg-icons/av/videocam';
import VideoOff from 'material-ui/svg-icons/av/videocam-off';
import ShareScreenOn from 'material-ui/svg-icons/communication/screen-share';
import ShareScreenStop from 'material-ui/svg-icons/communication/stop-screen-share';
import Link from 'material-ui/svg-icons/content/link';
import LeaveRoom from 'material-ui/svg-icons/communication/call-end';

import BaseAlert from '../../modals/BaseAlert';
import InviteModal from '../../modals/InviteModal';
import RaisedButton from 'material-ui/RaisedButton';
import {CopyToClipboard} from 'react-copy-to-clipboard';


const styles = {
    smallIcon: {
        width: 29,
        height: 29,
        color: '#dce5f4'
    },
    smallIconRed: {
        width: 29,
        height: 29,
        color: '#fc573a'
    },    
    small: {
        width: 50,
        height: 50,
        padding: 10
    }
};

class MainBottomControlls extends Component {
    
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
            if (roomCreatedFirstTime) {
                roomCreatedFirstTime(false);
            }
        }
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

    _leaveRoomEvent() {
        if (this.alert) {
            this.alert.open([
                <p key="conf">Are you sure you want to leave this chat room?</p>
            ]);
        }
    }

    handleCopy() {
        this.setState({copied: true});
        if (this.invite) { this.invite.close() };
    }    

    inviteOnClose() {
        this.props.sendNotificationFromComponent('Link copied!', 2000);
    }

    _renderVideoButton() {
        return(
            <IconButton tooltip="Camera off" tooltipPosition="top-right"
                iconStyle={styles.smallIcon}
                style={styles.small} >
                <VideoOn />
            </IconButton>          
        )
    }

    _renderMicButton() {
        return(
            <IconButton tooltip="Mic off" tooltipPosition="top-right"
                iconStyle={styles.smallIcon}
                style={styles.small} >
                <MicOn />
            </IconButton>          
        )
    }

    _renderShareScreen() {
        return(
            <IconButton tooltip="Screen share" tooltipPosition="top-right"  onClick={ e => this.inviteOthers() }
                iconStyle={styles.smallIcon}
                style={styles.small} >
                <ShareScreenOn />
            </IconButton>          
        )        
    }
    _renderRoomLink() {
        return(
            <IconButton tooltip="Chat group link" tooltipPosition="top-right"
                iconStyle={styles.smallIcon}
                style={styles.small} >
                <Link />
            </IconButton>          
        ) 
    }

    _renderLeaveRoom() {
        return(
            <IconButton onClick={e => this._leaveRoomEvent()} tooltip="Leave chat group" tooltipPosition="top-right"
                iconStyle={styles.smallIconRed}
                style={styles.small} >
                <LeaveRoom />
            </IconButton>          
        )
    }

    render() {
        return(
            <div className="chat-main-bottom-controlls">
                <div className="controlls-ui">
                    { this._renderVideoButton() }
                    { this._renderMicButton() }
                    { this._renderShareScreen() }
                    { this._renderRoomLink() }
                    { this._renderLeaveRoom() }
                    <BaseAlert maxWidth={350} ref={ r => this.alert = r } onCancel={() => {}} onAccept={() => this.props.leaveRoom()} />
                    <InviteModal onCancel={() => {this.inviteOnClose()}} hideCancelButton={true} maxWidth={500} ref={ r => this.invite = r } />
                </div>
            </div>            
        )
    }
}

const mapStateToProps = ({ roomId, roomJustCreated }, ownProps) => {
    return {
        roomId, roomJustCreated
    }
}

MainBottomControlls.propTypes = {
    roomId: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
    ]),
    roomJustCreated: PropTypes.bool
}

export default connect(mapStateToProps, { leaveRoom, sendNotificationFromComponent, roomCreatedFirstTime })(MainBottomControlls);