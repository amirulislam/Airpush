import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import BaseAlert from '../BaseAlert';
import _ from 'lodash';
import shortid from 'shortid';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import MediaSettings from '../beans/MediaSettings';

class MediaNeededAlert extends BaseAlert {

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
        setTimeout(() => this._open(), 1000);
    }

    _retry() {
        this.handleClose();
        window.location.reload();
    }

    _open() {
        if (this.props.data) {
            super.open(
                [
                    <div key={shortid.generate()}>
                        <p>You're about to enter a video meeting. The browser is blocking your camera and microphone.</p>
                        <p><b>To enter the chat group, click the camera icon in the right side of the address bar and allow access, than click "Retry".</b></p>
                        <div></div>
                        <p style={{fontStyle: 'italic'}}>When entering a video meeting your camera and microphone are:</p>
                        <MediaSettings />
                    </div>                    
                ]
            );
        }
    }

    _getActions() {
        let actions = [];
        actions.push(<RaisedButton key={shortid.generate()} label="Retry" primary={true} onClick={() => this._retry()}/>)
        return actions;
    }   

    render() {
        return super.render();
    }
}

MediaNeededAlert.propTypes = {
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

export default connect(mapStateToProps)(MediaNeededAlert);
