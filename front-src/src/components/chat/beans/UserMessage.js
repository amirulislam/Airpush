import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import safe from 'undefsafe';

class UserMessage extends Component {

    static defaultProps = {
        authenticated: false
    }

    constructor(props) {
        super(props);
    }

    _isMyMessage() {
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
                        <div className="text-content" dangerouslySetInnerHTML={{ __html: this.props.message.payload.textMessage }}>
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

UserMessage.propTypes = {
    message: PropTypes.object,
    authenticated: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.object
    ])    
}

export default connect(mapStateToProps)(UserMessage);
