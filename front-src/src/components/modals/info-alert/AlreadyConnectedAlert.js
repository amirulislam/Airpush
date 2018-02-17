import React from 'react';
import { connect } from 'react-redux';
import BaseAlert from '../BaseAlert';
import _ from 'lodash';
import shortid from 'shortid';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { joinRoomNow } from '../../../actions';
import StorageUtils from '../../../utils/Storage';
import SocketService from '../../../services/SocketService';

class AlreadyConnectedAlert extends BaseAlert {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this._open();
    }

    componentWillReceiveProps(newProps) {
        setTimeout(() => this._open(), 2000);
    }    

    _open() {
        if (this.props.data && this.props.data.data.message && !this.state.open) {
            super.open(
                [
                    <p key={shortid.generate()} dangerouslySetInnerHTML={{ __html: this.props.data.data.message }}></p>
                ]
            );
        }
    }

    handleClose() {
        super.handleClose();
        window.location = '/';
    }

    _useHere() {
        super.handleAccept();
        SocketService.getInstance().connect(true);
        // setTimeout(() => {
        //     window.location = '/';
        // }, 6000);
    }

    _getActions() {
        let actions = [];
        actions.push(<FlatButton label="Cancel" primary={false} onClick={() => this.handleClose()} key={shortid.generate()}/>)
        actions.push(<div className="spacer" key={shortid.generate()}></div>)
        actions.push(<RaisedButton key={shortid.generate()} label="Use here" primary={true} onClick={() => this._useHere()}/>)
        return actions;
    }   

    render() {
        return super.render();
    }
}

export default connect(null, { joinRoomNow })(AlreadyConnectedAlert);
