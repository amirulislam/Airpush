import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MainBottomControlls from './MainBottomControlls';
import MediaSource from './MediaSource';
import Utils from '../../../utils';
import ReactResizeDetector from 'react-resize-detector';

class ChatMainView extends Component {
    
    static defaultProps = {
        mediaSources: []
    }

    _componentHeight = 0;

    constructor(props) {
        super(props);
        this._onResize = this._onResize.bind(this);
    }

    componentWillReceiveProps(newProps) {
        console.log('AICI>>>> PROPS', newProps);
    }

    _renderMediaSourceFull() {
        return this.props.mediaSources.map(mediaSource => {
            if (mediaSource.isOpen) {
                return <MediaSource source={mediaSource} key={Utils.uid()} />
            }
        })
    }

    _onResize(w, h) {
        console.log('resize')
        this._componentHeight = h;
    }

    _calculateMediaSourceSize() {
        let h = 150;
        if (this._componentHeight > 0) {
            h = (this._componentHeight - 50) / 5;
            if (h > 300) {
                h = 300;
            }
        }
        console.log('HEIGHT', h);
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

    render() {
        return(
            <div className="chat-group-full-ui pull-left">
                <div className="chat-media-sources">
                    <div className="minimized-media-sources">
                        { this._renderMinimizied() }
                    </div>
                    { this._renderMediaSourceFull() }
                    <ReactResizeDetector handleWidth handleHeight onResize={this._onResize} />
                </div>
                <MainBottomControlls />
            </div>            
        )
    }
}

const mapStateToProps = ({ mediaSources }, ownProps) => {
    return {
        mediaSources
    }
}

ChatMainView.propTypes = {
    roomId: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string
    ]),
    mediaSources: PropTypes.array
}

export default connect(mapStateToProps, null)(ChatMainView);
