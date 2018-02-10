import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

class MyAccount extends Component {

    constructor(props) {
        super(props);
    }

    removeAccount() {

    }

    render() {
        return(
            <div className={ `section-content-ui section-content my-account` }>
                <p className="section-title">My account</p>
                <div className="inside-content-card">
                    <p className="card-title">Delete account</p>
                    <div className="card-title-underline"></div>
                    <div className="card-content">
                        <RaisedButton label="Delete account" secondary={true} onClick={ e => this.removeAccount() } />
                        <p className="info-text">Will erase your account from the database for good.<br />You can always sign in again with one of the available social networks.</p>
                    </div>
                </div>
                <div className="inside-content-card">
                    <p className="card-title">Privacy</p>
                    <div className="card-title-underline"></div>
                    <div className="card-content">
                        <p className="info-text">
                            We do not hold any chat messages one the server side, those are volatile.<br />
                            Once you leave a chat group they're gone for ever, even if you re-connect again.<br />
                            Any new user joining the group will not see previous messages from any existing chat group member.              
                        </p>
                    </div>
                </div>                
            </div>
        )
    }

}

export default MyAccount;
