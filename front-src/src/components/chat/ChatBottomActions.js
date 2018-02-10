import React, { Component } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import SendIcon from 'material-ui/svg-icons/content/send';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ShareScreenIcon from 'material-ui/svg-icons/communication/screen-share';
import VideoCallIcon from 'material-ui/svg-icons/notification/ondemand-video';
import AudioCallIcon from 'material-ui/svg-icons/image/audiotrack';
import FileService from '../../services/files/FileService';
import AcceptFileMessage from '../../models/AcceptFileMessage';
import { SOCKET_EVENTS, SOCKET_MESSAGE_TYPES } from '../../config';
import SocketService from '../../services/SocketService';
import { dispatchInternalMessageFromComponent } from '../../actions';

class ChatBottomActions extends Component {

    _fileInput;

    constructor(props) {
        super(props);
        this.state = { keyInputVal: '' };
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        // this.onAttachedFileAction = this.onAttachedFileAction.bind(this);
        // this._handleFileInputChange = this._handleFileInputChange.bind(this);
        this.onSendButtonClicked = this.onSendButtonClicked.bind(this);
    }

    onKeyUp(e) {
        if (e.keyCode === 13 && this.props.onEnter) {
            this.props.onEnter(this.state.keyInputVal);
            this.setState({ keyInputVal: '' })
        }
    }

    componentDidMount() {
        this._fileInput = document.getElementById('fileInput');
        // this._fileInput.addEventListener('change', this._handleFileInputChange, false);
    }

    _handleFileInputChange() {
        var file = fileInput.files[0];
        if (file) {            
            if (file.size === 0) {
                alert('File is empty, please select a non-empty file');
                return;
            }
            // console.log(FileService.getInstance().addFile(file));
            const fileModel = FileService.getInstance().addFile(file);
            const acceptFileMessageModel = new AcceptFileMessage(fileModel.getTransportData());
            SocketService.getInstance().send(acceptFileMessageModel, SOCKET_EVENTS.MESSAGE);
            
            // self message
            const offerFileMessageModel = new AcceptFileMessage(fileModel, SOCKET_MESSAGE_TYPES.INTERNAL_MESSAGE_OFFER);
            this.props.dispatchInternalMessageFromComponent({
                payload: offerFileMessageModel,
                type: offerFileMessageModel.type
            });
        }
    }

    onInputChange(e) {
        this.setState({ keyInputVal: e.currentTarget.value });
    }

    onSendButtonClicked() {
        if (this.state.keyInputVal !== '') {
            this.props.onEnter(this.state.keyInputVal);
            this.setState({ keyInputVal: '' })
        }
    }    

    // onAttachedFileAction() {
    //     PeerService.getInstance().createPeers();
    //     return;
    //     if (this._fileInput.click) {
    //         this._fileInput.click();
    //     }
    // }

    _renderAdditionalActions() {
        return(
            <div>
                <input id="fileInput" type="file" id="fileInput" name="files" style={{visibility: 'hidden', position: 'absolute', left: -1000}} />
                <div className="chat-main-control pull-left">
                    <IconMenu style={{ marginTop: '-6px' }} tooltip="Attach file"
                        iconButtonElement={
                        <IconButton><MoreVertIcon /></IconButton>
                        }
                        targetOrigin={{horizontal: 'left', vertical: 'bottom'}}
                        anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                    >
                        <MenuItem primaryText="Screen share" leftIcon={ <ShareScreenIcon /> } />
                        <MenuItem primaryText="Video call" leftIcon={ <VideoCallIcon /> } />
                        <MenuItem primaryText="Audio call" leftIcon={ <AudioCallIcon /> } />
                    </IconMenu>
                </div>                
            </div>                
        )
    }

    render() {
        return(
            <div className="bottom-chat-bar">            
                <input value={this.state.keyInputVal} className="chat-room-input pull-left" onChange={this.onInputChange} onKeyUp={ this.onKeyUp } type="text" />
                <div className="chat-main-control pull-left">
                    <IconButton style={{ marginTop: '-6px' }} tooltipPosition="top-center" 
                        onClick={ this.onSendButtonClicked }>
                            <SendIcon />
                    </IconButton>                    
                </div>
                <div className="clearfix"></div>
            </div>
        );
    }
}

export default connect(null, { dispatchInternalMessageFromComponent })(ChatBottomActions);

