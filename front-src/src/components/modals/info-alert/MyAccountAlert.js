import React from 'react';
import { connect } from 'react-redux';
import BaseAlert from '../BaseAlert';
import _ from 'lodash';
import shortid from 'shortid';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { removeAccount, logOut } from '../../../actions';

class MyAccountAlert extends BaseAlert {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this._open();
    }

    componentWillReceiveProps(newProps) {
        setTimeout(() => this._open(), 2000);
    }    

    _removeAccount() {
        if (confirm('Are you sure you want to remove your account?')) {
            this.props.removeAccount();
        }
    }

    _open() {
        if (this.props.data) {
            super.open(
                [
                    <div key={shortid.generate()}>
                        <div className="card-content">
                            <RaisedButton label="Delete account" secondary={true} onClick={ e => this._removeAccount() } />
                            <p className="info-text">Will erase your account from the database for good.<br />You can always sign in again with one of the available social networks.</p>
                        </div>                    
                    </div>                    
                ]
            );
        }
    }

    _getActions() {
        let actions = [];
        actions.push(<FlatButton label="Cancel" primary={false} onClick={() => super.handleClose()} key={shortid.generate()}/>)
        return actions;
    }   

    render() {
        return super.render();
    }
}

export default connect(null, { removeAccount, logOut })(MyAccountAlert);
