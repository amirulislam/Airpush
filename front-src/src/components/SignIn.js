import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from './common/Modal';
import { signIn } from '../actions';
import StorageUtils from '../utils/Storage';
import _ from 'lodash';
import safe from 'undefsafe';

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.getLinkedInUserdata = this.getLinkedInUserdata.bind(this);
    }

    componentDidMount() {
        window.onGoogleSignIn = (googleUser) => {
            if (StorageUtils.getUser()) {
                return;
            }
            const profile = googleUser.getBasicProfile();
            const id_token = googleUser.getAuthResponse().id_token;
            this.props.signIn(profile.getEmail(), 'GOOGLE', id_token, () => {
                this.googleSignOut();
            });
        }

        window.linkedinOnUserAuthReceived = function(data) {
            this.console.log('GET USER DATA', data);
        };
    }

    getLinkedInUserdata() {
        console.log('GET USER DATA');
        IN.API.Raw("/people/~:(id,firstName,lastName,emailAddress,picture-url)?format=json")
        .result(user => {
            console.log(user);
        })
        .error(err => {
            console.log(err);
        });        
    }

    signInLinkedin() {
        if (!window.linkedinJS_SDKLoaded) {
            alert('Linkedin library failed to load');
            return;
        }

        if (IN.ENV.auth.oauth_token && IN.ENV.auth.oauth_token !== '') {
          this.getLinkedInUserdata();
        } else {
            console.log('AUTHORIZE ')
            IN.User.authorize(linkedinOnUserAuthReceived);
        }
    }

    onAccept() {
        console.log('On accept child');
    }

    googleSignOut() {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
          // console.log('User signed out.');
          auth2.disconnect();
        });
    }

    dummySignIn() {
        this.props.signIn('', 'GOOGLE', '', () => {
            
        });        
    }

    render() {
        return(
            <div className="sign-in-ui">
                <Modal { ...this.props } title="Sign in" wdt={350} onAccept={ this.onAccept }>
                    <div id="g-signin2" className="g-signin2 login-space-bottom" data-onsuccess="onGoogleSignIn">
                    </div>
                    <a href="#" className="login-base-button facebook-login login-space-bottom">Sign in with Facebook</a>
                    <a href="#" className="login-base-button twitter-login" onClick={ e => this.dummySignIn() }>Sign in with Twitter</a>
                </Modal>
            </div>
        )
    }
}

export default connect(null, { signIn })(SignIn);
