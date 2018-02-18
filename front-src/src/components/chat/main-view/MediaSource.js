import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import safe from 'undefsafe';
import { maximizeMediaSource, openFullScreen } from '../../../actions';
import Fullscreen from "react-full-screen";
import VideoOff from 'material-ui/svg-icons/av/videocam-off';
import { bannerFullScreen } from '../../../config/advertise';
import { SHOW_ADVERT_FULL_SCREEN } from '../../../config';

class MediaSource extends Component {

    static defaultProps = {
        source: {},
        isFullScreen: false
    }

    constructor(props) {
        super(props);
        this.state = { isFullScreen: false };
        this._handleClick = this._handleClick.bind(this)
    }

    componentDidMount() {
        if (!_.isNil(safe(this.props, 'source.stream')) && this.videRef) {
            this.videRef.srcObject = this.props.source.stream;
        }
    }

    componentWillReceiveProps({ fullScreen }) {
        this.setState({isFullScreen: fullScreen});
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
        let videoStreamIsEnabled = true;
        if (this.props.source && this.props.source.stream) {
            videoStreamIsEnabled = this.props.source.stream.enabled;
        }
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

    _openFullScreen(isFull) {
        this.props.openFullScreen(isFull);
        if (this.props._onFullScreenChange) {
            this.props._onFullScreenChange(isFull);
        }
    }

    _renderFullScreenAdvertisment() {     
        if (this.state.isFullScreen && SHOW_ADVERT_FULL_SCREEN) {
            return(
                <div className="full-screen-advertisment-bottom">
                    <div className="add-728x90">
                        { bannerFullScreen() }
                    </div>                    
                </div>
            )
        }
    }
    _triggerAd() {
        if (this.state.isFullScreen && SHOW_ADVERT_FULL_SCREEN) {
            setTimeout(() => {
                try {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                } catch (err) {
                    console.log(err)
                }
            }, 1000)
        }
    }

    _renderFullScrrenNode() {
        const userName = !_.isNil(safe(this.props, 'source.user.name')) ? this.props.source.user.name : '';
        if (this._isOpened()) {
            return(
                <Fullscreen
                enabled={this.props.fullScreen}
                onChange={isFull => this._openFullScreen(isFull)}
                >                
                    <div className={this._renderMediaSourceClass()} onClick={this._handleClick} style={this._getSizeStyle()}>                 
                        { this._renderVideo() }
                        <p className="media-source-user">{ userName }</p>
                        { this._renderFullScreenAdvertisment() }
                        { this._triggerAd() }
                    </div>
                </Fullscreen>                
            )
        } else {
            return(
                <div className={this._renderMediaSourceClass()} onClick={this._handleClick} style={this._getSizeStyle()}>
                    { this._renderVideo() }
                    <p className="media-source-user">{ userName }</p>
                </div>
            )
        }
    }

    render() {
        return this._renderFullScrrenNode();
    }
}

const mapStateToProps = ({ fullScreen }, ownProps) => {
    return {
        fullScreen
    }
}

MediaSource.propTypes = {
    source: PropTypes.object,
    fullScreen: PropTypes.bool
}

MediaSource.propTypes = {
    fullScreen: PropTypes.bool
}

export default connect(mapStateToProps, { maximizeMediaSource, openFullScreen })(MediaSource);
