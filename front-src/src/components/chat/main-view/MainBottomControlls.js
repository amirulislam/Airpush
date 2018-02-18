import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import shortid from 'shortid';
import { leaveRoom, sendNotificationFromComponent, roomCreatedFirstTime, openFullScreen } from '../../../actions';

import IconButton from 'material-ui/IconButton';
import MicOn from 'material-ui/svg-icons/av/mic';
import MicOff from 'material-ui/svg-icons/av/mic-off';
import VideoOn from 'material-ui/svg-icons/av/videocam';
import VideoOff from 'material-ui/svg-icons/av/videocam-off';
import ShareScreenOn from 'material-ui/svg-icons/communication/screen-share';
import ShareScreenStop from 'material-ui/svg-icons/communication/stop-screen-share';
import Link from 'material-ui/svg-icons/content/link';
import LeaveRoom from 'material-ui/svg-icons/communication/call-end';
import LaunchFullScreen from 'material-ui/svg-icons/action/open-in-new';
import ExitFullScreen from 'material-ui/svg-icons/action/flip-to-back';

import BaseAlert from '../../modals/BaseAlert';
import InviteModal from '../../modals/InviteModal';
import RaisedButton from 'material-ui/RaisedButton';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import MediaManager from '../../../services/media/MediaManager';
import StorageUtils from '../../../utils/Storage';
import ReactResizeDetector from 'react-resize-detector';
import { smallBannerAd } from '../../../config/advertise';
import { SHOW_ADVERT_VIDEO_CHAT } from '../../../config';


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
        const mediaSettings = StorageUtils.getUserMediaSettings();
        this.state = { 
            value: '', 
            copied: false, 
            alreadyShowedLink: false,
            videoEnabled: _.isObject(mediaSettings) ? mediaSettings.camState : true,
            audioEnabled: _.isObject(mediaSettings) ? mediaSettings.micState : true,
            compWidth: 0,
            adWidth: 0
        }      
        this._onResize = this._onResize.bind(this);
        this._delayedResize = _.debounce((w, h) => {
            if (this.controllsUI && this.controllsUI.getClientRects) {
                const rectangle = this.controllsUI.getClientRects()[0];
                if (rectangle.right && _.isNumber(rectangle.right) && _.isNumber(w)) {
                    this.setState({ adWidth: w - rectangle.right });
                }
            }

        }, 500);         
    }

    static defaultProps = {
        roomId: '',
        roomJustCreated: false,
        fullScreen: false
    }

    componentDidMount() {
        this.setState({ value: `${window.location.protocol}//${window.location.host}/app?r=${this.props.roomId}` });
        if (SHOW_ADVERT_VIDEO_CHAT) {
            setTimeout(() => {
                try {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                } catch (err) {
                    console.log(err)
                }
            }, 1000)
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({ value: `${window.location.protocol}//${window.location.host}/app?r=${this.props.roomId}` });
        if (newProps.roomJustCreated && !this.state.alreadyShowedLink) {
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
            this.setState({ alreadyShowedLink: true });
            this.invite.open([
                <p key={shortid.generate()}>Invite others to this chat group. Copy the link below &amp; send it to your friends.</p>,
                <div key={shortid.generate()} className="share-link">
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

    _enableDisableVideo(videoEnabled = true) {    
        this.setState({ videoEnabled });
        if (MediaManager.getInstance().hasLocalStream()) {
            MediaManager.getInstance().toggleVideo(videoEnabled);
        }
    }

    _renderVideoButton() {
        if (this.state.videoEnabled) {
            return(
                <IconButton onClick={ e => this._enableDisableVideo(false)} tooltip="Turn camera off" tooltipPosition="top-right"
                    iconStyle={styles.smallIcon}
                    style={styles.small} >
                    <VideoOn />
                </IconButton> 
            )
        } else {
            return(
                <IconButton onClick={ e => this._enableDisableVideo(true)} tooltip="Turn camera on" tooltipPosition="top-right"
                    iconStyle={styles.smallIcon}
                    style={styles.small} >
                    <VideoOff />
                </IconButton>          
            )
        }
    }

    _enableDisableAudio(audioEnabled = true) {    
        this.setState({ audioEnabled });
        if (MediaManager.getInstance().hasLocalStream()) {
            MediaManager.getInstance().toggleAudio(audioEnabled);
        }
    }    

    _renderMicButton() {
        if (this.state.audioEnabled) {
            return(
                <IconButton onClick={ e => this._enableDisableAudio(false)} tooltip="Turn mic off" tooltipPosition="top-right"
                    iconStyle={styles.smallIcon}
                    style={styles.small} >
                    <MicOn />
                </IconButton>                  
            )
        } else {
            return( 
                <IconButton onClick={ e => this._enableDisableAudio(true)} tooltip="Turn mic on" tooltipPosition="top-right"
                    iconStyle={styles.smallIcon}
                    style={styles.small} >
                    <MicOff />
                </IconButton>                       
            )
        }
    }

    _toggleFullScreen() {
        this.props.openFullScreen(!this.props.fullScreen);
    }
    _renderFullScreen() {
        if (!this.props.fullScreen) {
            return(
                <IconButton onClick={ e => this._toggleFullScreen()} tooltip="Go full screen" tooltipPosition="top-right"
                    iconStyle={styles.smallIcon}
                    style={styles.small} >
                    <LaunchFullScreen />
                </IconButton>          
            )
        } else {
            return(
                <IconButton onClick={ e => this._toggleFullScreen()} tooltip="Exit full screen" tooltipPosition="top-right"
                    iconStyle={styles.smallIcon}
                    style={styles.small} >
                    <ExitFullScreen />
                </IconButton>          
            )            
        }
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
            <IconButton tooltip="Chat group link" tooltipPosition="top-right" onClick={ e => this.inviteOthers() }
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

    _onResize(w, h) {
        this._delayedResize(w, h);
    }

    _renderAdvertise() {
        let style = { width: `${320}px`, display: 'none' };
        if (this.state.adWidth >= 320 && this.props.chatOpenState === false) {
            style.display = 'block';
        }
        if (SHOW_ADVERT_VIDEO_CHAT) {
            return(
                <div style={style} className="right-controls-advertise">
                    { smallBannerAd() }
                </div>
            )
        }
    }

    render() {
        return(
            <div className="chat-main-bottom-controlls">
                <div ref={r => this.controllsUI = r } className="controlls-ui">
                    { this._renderVideoButton() }
                    { this._renderMicButton() }
                    { this._renderFullScreen() }
                    { this._renderShareScreen() }
                    { this._renderRoomLink() }
                    { this._renderLeaveRoom() }
                    <BaseAlert maxWidth={350} ref={ r => this.alert = r } onCancel={() => {}} onAccept={() => this.props.leaveRoom()} />
                    <InviteModal onCancel={() => {this.inviteOnClose()}} hideCancelButton={true} maxWidth={500} ref={ r => this.invite = r } />
                </div>
                { this._renderAdvertise() }
                <ReactResizeDetector handleWidth handleHeight onResize={this._onResize} />
            </div>            
        )
    }
}

const mapStateToProps = ({ roomId, roomJustCreated, fullScreen, chatOpenState }, ownProps) => {
    return {
        roomId, roomJustCreated, fullScreen, chatOpenState
    }
}

MainBottomControlls.propTypes = {
    roomId: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
    ]),
    roomJustCreated: PropTypes.bool,
    fullScreen: PropTypes.bool
}

export default connect(mapStateToProps, { leaveRoom, sendNotificationFromComponent, roomCreatedFirstTime, openFullScreen })(MainBottomControlls);