import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import safe from 'undefsafe';
import filesize from 'filesize';
import FlatButton from 'material-ui/FlatButton';

class FileMessageOfferUi extends Component {

    static defaultProps = {
        authenticated: false
    }

    constructor(props) {
        super(props);
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
        this.setState({ downloadAccepted: true })
    }

    _renderCancel() {

    }

    render() {
        console.log('>>>>', this.props.message);
        return(
            <div className="user-message">
                <div className={`${this._messageClass()}`}>
                    <div className={ this._userUiCSS() }>
                        { this._renderMessageArrow() }
                    </div>
                    <div className="clearfix"></div>
                    <div className="message-body">
                        <div className="accept-message-content">
                        <p>You have sent "<span className="file-name">{this.props.message.payload.fileModel.name}</span>" ({filesize(this.props.message.payload.fileModel.size, {round: 0})}). Waiting for others to accept the file ...</p>
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

FileMessageOfferUi.propTypes = {
    message: PropTypes.object,
    authenticated: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.object
    ])    
}

export default connect(mapStateToProps)(FileMessageOfferUi);
