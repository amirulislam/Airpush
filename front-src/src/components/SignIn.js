import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from './common/Modal';
import { signIn } from '../actions';
import StorageUtils from '../utils/Storage';

class SignIn extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        window.onGoogleSignIn = (googleUser) => {
            if (!_.isNil(StorageUtils.getStorageData())) {
                return;
            }
            const profile = googleUser.getBasicProfile();
            const id_token = googleUser.getAuthResponse().id_token;
            this.props.signIn(profile.getEmail(), 'GOOGLE', id_token, () => {
                this.googleSignOut();
            });
        }
    }

    onAccept() {
        console.log('On accept child');
    }

    googleSignOut() {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
          console.log('User signed out.');
          auth2.disconnect();
        });
    }

    render() {
        return(
            <div className="sign-in-ui">
                <Modal { ...this.props } title="Sign in" wdt={350} onAccept={ this.onAccept }>
                    <div id="g-signin2" className="g-signin2 login-space-bottom" data-onsuccess="onGoogleSignIn">
                    </div>
                    <a href="#" className="login-base-button facebook-login login-space-bottom">Sign in with Facebook</a>
                    <a href="#" className="login-base-button twitter-login">Sign in with Twitter</a>
                </Modal>
            </div>
        )
    }
}

export default connect(null, { signIn })(SignIn);
