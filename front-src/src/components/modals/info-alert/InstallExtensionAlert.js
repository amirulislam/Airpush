import React from 'react';
import { connect } from 'react-redux';
import BaseAlert from '../BaseAlert';
import _ from 'lodash';
import shortid from 'shortid';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';
import { INSTALL_EXTENSION_URL } from '../../../config';

class InstallExtensionAlert extends BaseAlert {

    constructor(props) {
        super(props);
        console.log('construct')
    }

    componentDidMount() {
        this._open();
    }

    componentWillReceiveProps(newProps) {
        setTimeout(() => this._open(), 1000);
    }

    _open() {
        if (this.props.data && !this.state.open) {
            super.open(
                [
                    <p key={shortid.generate()}>In order to be able to share your screen you have to install Airpush - Chrome Extension.</p>
                ]
            );
        }
    }

    _installExtension() {
        super.handleClose();
        let win = window.open(INSTALL_EXTENSION_URL, '_blank');
        win.focus();
    }

    _getActions() {
        let actions = [];
        actions.push(<FlatButton label="Cancel" primary={false} onClick={() => super.handleClose()} key={shortid.generate()}/>)
        actions.push(<div className="spacer" key={shortid.generate()}></div>)
        actions.push(<RaisedButton key={shortid.generate()} label="Install extension" primary={true} onClick={() => this._installExtension()}/>)
        return actions;
    }   

    render() {
        return super.render();
    }
}

InstallExtensionAlert.propTypes = {
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

export default connect(mapStateToProps)(InstallExtensionAlert);
