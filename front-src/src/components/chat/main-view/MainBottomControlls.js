import React, { Component } from 'react';
import { connect } from 'react-redux';

import IconButton from 'material-ui/IconButton';
import MicOn from 'material-ui/svg-icons/av/mic';
import MicOff from 'material-ui/svg-icons/av/mic-off';
import VideoOn from 'material-ui/svg-icons/av/videocam';
import VideoOff from 'material-ui/svg-icons/av/videocam-off';
import ShareScreenOn from 'material-ui/svg-icons/communication/screen-share';
import ShareScreenStop from 'material-ui/svg-icons/communication/stop-screen-share';
import Link from 'material-ui/svg-icons/content/link';
import LeaveRoom from 'material-ui/svg-icons/communication/call-end';


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
            <IconButton tooltip="Screen share" tooltipPosition="top-right"
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
            <IconButton tooltip="Leave chat group" tooltipPosition="top-right"
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
                </div>
            </div>            
        )
    }
}

export default MainBottomControlls;