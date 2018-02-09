import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import safe from 'undefsafe';
import filesize from 'filesize';
import FlatButton from 'material-ui/FlatButton';
import { removeInternalMessage } from '../../../actions';
import PeerService from '../../../services/peer/PeerService';

class AcceptFileMessageUi extends Component {

    static defaultProps = {
        authenticated: false
    }

    constructor(props) {
        super(props);
        this.state = { acceptedFile: false }
    }

    componentWillReceiveProps(nextProps) {
        console.log('next props', nextProps);
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
        if (!_.isNil(safe(this.props, 'message.payload._id')) && !this.state.acceptedFile) {
            this.setState({ acceptedFile: true });
            PeerService.getInstance().createFilePeer(this.props.message.payload.fileModel, this.props.message.payload.user);
            // console.log(this.props.message.payload.fileModel);
            this.props.removeInternalMessage(this.props.message._id);
        }
    }

    _renderAccept() {
        return(
            <div className="pull-right">
                <FlatButton label="Download" secondary={true} onClick={ e => this.acceptDownload() } />
            </div>          
        )
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
                            <p>{this.props.message.payload.user.name} has sent "<span className="file-name">{this.props.message.payload.fileModel.name}</span>" ({filesize(this.props.message.payload.fileModel.size, {round: 0})})</p>
                            { this._renderAccept() }
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

export default connect(mapStateToProps, { removeInternalMessage })(AcceptFileMessageUi);
