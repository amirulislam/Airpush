import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import MainBottomControlls from './MainBottomControlls';
import MediaSource from './MediaSource';
import Utils from '../../../utils';
import ReactResizeDetector from 'react-resize-detector';
import ActionMenu from 'material-ui/svg-icons/navigation/menu';
import IconButton from 'material-ui/IconButton';
import { changeOpenChatState } from '../../../actions';

class ChatMainView extends Component {
    
    static defaultProps = {
        mediaSources: [],
        chatOpenState: true
    }

    _componentHeight = 0;

    constructor(props) {
        super(props);
        this._onResize = this._onResize.bind(this);
        this.state = { compHeight: 0 };
        this._delayedResize = _.debounce((w, h) => {
            if (!this._isFullScreen) {
                this.setState({ compHeight: h })
            }
        }, 700);
    }

    _onFullScreenChange(isFullScreen) {
        this._isFullScreen = isFullScreen;
    }

    _renderMediaSourceFull() {
        return this.props.mediaSources.map(mediaSource => {
            if (mediaSource.isOpen) {
                return <MediaSource _onFullScreenChange={f => this._onFullScreenChange(f)} source={mediaSource} key={Utils.uid()} />
            }
        })
    }

    _onResize(w, h) {
        this._delayedResize(w, h);
    }

    _calculateMediaSourceSize() {
        let h = 150;
        const bottomSpace = 50;
        const maxSourceHeight = 150;
        let totalSlots = 5;
        if (this.props.mediaSources) {
            totalSlots = this.props.mediaSources.length;
        }
        if (this.state.compHeight > 0) {
            h = (this.state.compHeight - bottomSpace) / totalSlots;
            if (h > maxSourceHeight) {
                h = maxSourceHeight;
            }
        }
        let w = (100 * h) / 75;
        return { w, h };
    }
    
    _renderMinimizied() {
        this._calculateMediaSourceSize();
        return this.props.mediaSources.map(mediaSource => {
            if (!mediaSource.isOpen) {
                return <MediaSource source={mediaSource} size={this._calculateMediaSourceSize()} key={Utils.uid()} />
            }
        })        
    }

    _openCloseChatState() {
        this.props.changeOpenChatState();
        // changeOpenChatState
    }

    _tooltip() {
        return this.props.chatOpenState ?  'Hide messenger' : 'Show messenger';
    }

    _renderOpenMenuButton() {
        return(
            <div className="open-close-menu">
                <IconButton onClick={ e => this._openCloseChatState() } iconStyle={{ color: '#F2F2F2' }} tooltip={this._tooltip()} tooltipPosition="bottom-left">
                    <ActionMenu />
                </IconButton>
            </div>
        );
    }    

    _renderSizeCSS() {
        if (this.props.chatOpenState) {
            return 'chat-group-full-ui sidebar-open pull-left';
        } else {
            return 'chat-group-full-ui sidebar-close pull-left';
        }
    }    

    render() {
        return(
            <div className={this._renderSizeCSS()}>
                <div className="chat-media-sources">
                    <div className="minimized-media-sources">
                        { this._renderMinimizied() }
                    </div>
                    { this._renderMediaSourceFull() }
                    <ReactResizeDetector handleWidth handleHeight onResize={this._onResize} />
                </div>
                <MainBottomControlls />
                { this._renderOpenMenuButton() }
            </div>            
        )
    }
}

const mapStateToProps = ({ mediaSources, chatOpenState }, ownProps) => {
    return {
        mediaSources, chatOpenState
    }
}

ChatMainView.propTypes = {
    roomId: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
    ]),
    mediaSources: PropTypes.array,
    chatOpenState: PropTypes.bool
}

export default connect(mapStateToProps, { changeOpenChatState })(ChatMainView);
