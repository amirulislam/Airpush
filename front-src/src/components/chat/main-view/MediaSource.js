import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import safe from 'undefsafe';
import { maximizeMediaSource } from '../../../actions';

class MediaSource extends Component {

    static defaultProps = {
        source: {}
    }

    constructor(props) {
        super(props);
        this._handleClick = this._handleClick.bind(this)
    }

    componentDidMount() {
        if (!_.isNil(safe(this.props, 'source.stream')) && this.videRef) {
            this.videRef.srcObject = this.props.source.stream;
        }
    }

    isMe() {
        if (this.props.source) {
            return this.props.source.peerId === 'me';
        }
        return false;
    }
    
    _isOpened() {
        return this.props.source.isOpen;
    }

    _renderMediaSourceClass() {
        return this._isOpened() ? 'media-source-full' : 'media-source';
    }

    _getSizeStyle() {
        if (!this._isOpened() && this.props.size) {
            return {
                width: `${this.props.size.w}px`,
                height: `${this.props.size.h}px`
            }
        }
    }

    _renderVideo() {
        console.log('IS ME', this.isMe())
        if (this.isMe()) {
            return <video ref={r => { this.videRef = r }} muted autoPlay></video>
        } else {
            return <video ref={r => { this.videRef = r }} muted autoPlay></video>
        }
    }

    _handleClick() {
        if (this._isOpened()) {
            return;
        }
        this.props.maximizeMediaSource(this.props.source.peerId);
    }

    render() {
        const userName = !_.isNil(safe(this.props, 'source.user.name')) ? this.props.source.user.name : '';
        return(
            <div onClick={this._handleClick} className={this._renderMediaSourceClass()} style={this._getSizeStyle()}>
                { this._renderVideo() }
                <p className="media-source-user">{ userName }</p>
            </div>            
        )
    }
}

MediaSource.propTypes = {
    source: PropTypes.object
}

export default connect(null, { maximizeMediaSource })(MediaSource);
