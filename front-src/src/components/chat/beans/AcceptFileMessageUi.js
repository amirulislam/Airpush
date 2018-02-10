import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import safe from 'undefsafe';
import filesize from 'filesize';
import FlatButton from 'material-ui/FlatButton';
import { removeInternalMessage } from '../../../actions';
// import PeerService from '../../../services/peer/PeerService';
import LinearProgress from 'material-ui/LinearProgress';
import shortid from 'shortid';
import { alterMessage } from '../../../actions';

class AcceptFileMessageUi extends Component {

    static defaultProps = {
        authenticated: false
    }

    constructor(props) {
        super(props);
    }

    _isMyMessage() {
        return false;
        let isMyMessage = false;
        if (this.props.authenticated && this.props.message) {
            const isUser = !_.isNil(safe(this.props, 'message.payload.user._id'));
            if (this.props.message.payload.user._id == this.props.authenticated._id) {
                isMyMessage = true;
            }
        }
        return isMyMessage;
    }

    _messageClass() {
        if (this._isMyMessage()) {
            return 'user-message-content owner';
        }
        return 'user-message-content stranger';
    }

    _userUiCSS() {
        if (this._isMyMessage()) {
            return 'user pull-right';
        }
        return 'user pull-left';
    }

    _renderMessageArrow() {
        if (this._isMyMessage()) {
            return(
                <div className="message-arrow right">
                    <img src="/assets/img/message-arrow-me.png" />
                </div>
            )
        } else {
            return(
                <div className="message-arrow left">
                    <img src="/assets/img/message-arrow-other.png" />
                </div>
            )            
        }
    }

    acceptDownload() {
        if (!_.isNil(safe(this.props, 'message.payload._id'))) {
            console.log(this.props.message);
            this.props.alterMessage(this.props.message.payload._id, {
                acceptedFile: true
            });
            // PeerService.getInstance().createFilePeer(this.props.message.payload.fileModel, this.props.message.payload.user, this.props.message.payload._id);
            // console.log(this.props.message.payload.fileModel);
            // this.props.removeInternalMessage(this.props.message._id);
        }
    }

    _getAcceptedFile() {
        let accepted = false;
        if (!_.isNil(safe(this.props, 'message.payload.acceptedFile'))) {
            accepted = this.props.message.payload.acceptedFile;
        }
        return accepted;
    }

    _getFileBlob() {
        let fileBlob = false;
        if (!_.isNil(safe(this.props, 'message.payload.fileBlob'))) {
            fileBlob = this.props.message.payload.fileBlob;
        }
        return fileBlob;
    }    

    _getDownloadPercent() {
        let percent = 0;
        if (!_.isNil(safe(this.props, 'message.payload.downloadProgress'))) {
            percent = this.props.message.payload.downloadProgress;
        }
        return percent;
    }    

    _renderAccept() {
        if (!this._getAcceptedFile()) {
            return(
                <div className="pull-right">
                    <FlatButton label="Accept file" secondary={true} onClick={ e => this.acceptDownload() } />
                </div>          
            )
        }
    }

    _renderFileMessageInfo() {
        const size = filesize(this.props.message.payload.fileModel.size, {round: 0});
        const percent = this._getDownloadPercent();
        // const downloaded = (size * percent) / 100
        const downloaded = filesize(((this.props.message.payload.fileModel.size * percent) / 100), {round: 0});

        if (!this._getFileBlob()) {
            if (!this._getAcceptedFile()) {
                return <p>{this.props.message.payload.user.name} has sent <span className="file-name">{this.props.message.payload.fileModel.name}</span> ({size})</p>
            } else {
                return <p>Downloading <span className="file-name">{this.props.message.payload.fileModel.name}</span> ({size}) {downloaded}</p>
            }
        }
    }

    _renderProgress() {
        const percent = this._getDownloadPercent();
        if (this._getAcceptedFile() && percent < 100) {
            return(
                <div>
                    <LinearProgress mode="determinate" value={ percent } />
                </div>
            )
        }
    }

    _renderDownloadLink() {
        const fb = this._getFileBlob();
        if (fb) {
            return(
                <div>
                    <a id={shortid.generate()} download={this.props.message.payload.fileModel.name} href={ URL.createObjectURL(fb) }>Save to disk "{this.props.message.payload.fileModel.name}" ({filesize(this.props.message.payload.fileModel.size, {round: 0})})</a>
                </div>
            )
        }
    }

    render() {
        return(
            <div className="user-message">
                <div className={`${this._messageClass()}`}>
                    <div className={ this._userUiCSS() }>
                        { this._renderMessageArrow() }
                        <img className="user-photo pull-left" src={this.props.message.payload.user.photo} />
                        <p className="user-name pull-left">{this.props.message.payload.user.name}</p>
                        <div className="clearfix"></div>
                    </div>
                    <div className="clearfix"></div>
                    <div className="message-body">
                        <div className="accept-message-content">
                            <div>{ this._renderFileMessageInfo() }</div>
                            { this._renderAccept() }
                            { this._renderProgress() }
                            { this._renderDownloadLink() }
                            <div className="clearfix"></div>
                        </div>
                    </div>                
                </div>
                <div className="clearfix"></div>
            </div>
        )
    }
}

const mapStateToProps = ({ authenticated }, ownProps) => {
    return {
        authenticated
    }
}

AcceptFileMessageUi.propTypes = {
    message: PropTypes.object,
    authenticated: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.object
    ])    
}

export default connect(mapStateToProps, { removeInternalMessage, alterMessage })(AcceptFileMessageUi);
