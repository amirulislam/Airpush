import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getUserMediaSettings, updateUserMediaSettings } from '../../../actions';
import Checkbox from 'material-ui/Checkbox';
import StorageUtils from '../../../utils/Storage';

class MediaSettings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            camState: false,
            micState: false
        };
    }

    componentWillMount() {
        this.props.getUserMediaSettings();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.mediaSettings) {
            this.setState({
                camState: newProps.mediaSettings.camState,
                micState: newProps.mediaSettings.micState
            });            
        }
    }
    
    updateCamCheck() {
        this.setState({camState: !this.state.camState }, () => {
            this._updateMediaSettings();
        })
    }

    updateMicCheck(e) {
        this.setState({micState: !this.state.micState }, () => {
            this._updateMediaSettings();
        })
    }    

    _updateMediaSettings() {
        const mediaSettings = {
            camState: this.state.camState,
            micState: this.state.micState            
        }
        StorageUtils.setUserMediaSettings(mediaSettings);
        this.props.updateUserMediaSettings(mediaSettings);        
    }

    render() {
        return(
            <div className="media-settings-bean">
                <Checkbox
                    label="Video camera is on"
                    checked={this.state.camState}
                    onCheck={this.updateCamCheck.bind(this)}
                />
                <Checkbox
                    label="Microphone is on"
                    checked={this.state.micState}
                    onCheck={this.updateMicCheck.bind(this)}
                />                
            </div>
        )
    }
}

const mapStateToProps = ({ mediaSettings }, ownProps) => {
    return {
        mediaSettings
    }
}

MediaSettings.propTypes = {
    mediaSettings: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.object
    ])
}

export default connect(mapStateToProps, { getUserMediaSettings, updateUserMediaSettings })(MediaSettings);
