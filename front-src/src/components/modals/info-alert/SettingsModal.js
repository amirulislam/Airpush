import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import BaseAlert from '../BaseAlert';
import _ from 'lodash';
import shortid from 'shortid';
import RaisedButton from 'material-ui/RaisedButton';
import MediaSettings from '../beans/MediaSettings';

class SettingsModal extends BaseAlert {

    static defaultProps = {
        infoAlertData: false
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this._open();
    }

    componentWillReceiveProps(newProps) {
        setTimeout(() => this._open(), 300);
    }

    _open() {
        if (this.props.data) {
            super.open(
                [
                    <div key={shortid.generate()}>
                        <p>When entering a video meeting your camera and microphone are:</p>
                        <MediaSettings />
                    </div>                    
                ]
            );
        }
    }

    _getActions() {
        let actions = [];
        actions.push(<RaisedButton key={shortid.generate()} label="OK" primary={true} onClick={() => super.handleClose()}/>)
        return actions;
    }   

    render() {
        return super.render();
    }
}

SettingsModal.propTypes = {
    infoAlertData: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.object
    ]),
}

const mapStateToProps = ({ infoAlertData }, ownProps) => {
    return {
        infoAlertData
    }
}

export default connect(mapStateToProps)(SettingsModal);
