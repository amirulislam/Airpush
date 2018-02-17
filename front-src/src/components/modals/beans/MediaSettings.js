import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getUserMediaSettings, updateUserMediaSettings } from '../../../actions';
import Checkbox from 'material-ui/Checkbox';

class MediaSettings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            camState: true,
            micState: true
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
        const state = !this.state.camState;
        this.setState({
            camState: state
        })
        this._updateMediaSettings();
    }

    updateMicCheck(e) {
        const state = !this.state.micState;
        console.log('AAAAA', state);
        // this.setState({
        //     micState: false
        // })
   this.setState((oldState) => {
      return {
        micState: !this.state.micState,
      };
    });        
        console.log('STATE', this.state);
        this._updateMediaSettings();
    }    

    _updateMediaSettings() {
        console.log('STATE2', this.state);
        return;
        this.props.updateUserMediaSettings({
            camState: this.state.camState,
            micState: this.state.micState
        });        
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
