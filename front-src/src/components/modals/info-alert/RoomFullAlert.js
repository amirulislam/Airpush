import React from 'react';
import { connect } from 'react-redux';
import BaseAlert from '../BaseAlert';
import _ from 'lodash';
import shortid from 'shortid';
import FlatButton from 'material-ui/FlatButton';
import { joinRoomNow } from '../../../actions';
import StorageUtils from '../../../utils/Storage';

class RommFullAlert extends BaseAlert {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this._open(this.props);
    }

    componentWillReceiveProps(newProps) {
        setTimeout(() => this._open(), 2000);
    }

    _open() {
        if (this.props.data && this.props.data.data.message && !this.state.open) {
            super.open(
                [
                    <p key={shortid.generate()}>{this.props.data.data.message}</p>
                ]
            );
        }
    }

    _retryConnect() {
        super.handleAccept();
        if (StorageUtils.getJoinedRoom()) {
            this.props.joinRoomNow(StorageUtils.getJoinedRoom());
        }
    }

    _getActions() {
        let actions = [];
        actions.push(<FlatButton label="Retry" primary={true} onClick={() => this._retryConnect()}/>)
        actions.push(<FlatButton label="Cancel" primary={false} onClick={() => super.handleClose()}/>)    
        return actions;
    }   

    render() {
        return super.render();
    }
}

export default connect(null, { joinRoomNow })(RommFullAlert);
