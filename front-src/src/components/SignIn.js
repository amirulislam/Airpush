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

        // on google sign in
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

        // on linkedin user outh received
        window.linkedinOnUserAuthReceived = data => {
            this.getLinkedInUserdata();
        };
    }

    // get linkedin user
    getLinkedInUserdata() {
        IN.API.Raw("/people/~:(id,firstName,lastName,emailAddress,picture-url)?format=json")
        .result(user => {
            this.props.signIn(user.emailAddress, 'LINKEDIN', IN.ENV.auth.oauth_token, () => {
                try {
                    IN.User.logout();
                } catch (err) { console.log(err);};
            });
        })
        .error(err => {
            console.log(err);
        });        
    }

    // sign in with linkedin
    signInLinkedin() {
        if (!window.linkedinJS_SDKLoaded) {
            alert('Linkedin library failed to load');
            return;
        }

        if (IN.ENV.auth.oauth_token && IN.ENV.auth.oauth_token !== '') {
            this.getLinkedInUserdata();
        } else {
            IN.User.authorize(linkedinOnUserAuthReceived);
        }
    }

    // google sign out
    googleSignOut() {
        var auth2 = gapi.auth2.getAuthInstance();
        try {
            auth2.signOut().then(function () {
                auth2.disconnect();
            });
        } catch (err) {
            console.log('Err', err);
        }
    }

    // sign in with facebook 
    signInWithFacebook() {
        if (!FB) {
            return;
        }
        // try {
        //     FB.logout();
        // } catch (e) {};

        FB.login(response => {
            if (response.authResponse) {
                this.props.signIn(response.authResponse.userID, 'FACEBOOK', response.authResponse.accessToken, () => {
                    try {
                        FB.logout(response.authResponse.accessToken);
                    } catch (err) { console.log(err);};
                });

                
                // console.log('Welcome!  Fetching your information.... ');
                // FB.api('/me', function(response) {
                //     console.log('Good to see you, ' + response.name + '.');
                // });
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        });
    }

    dummySignIn() {
        return;
        this.props.signIn('', 'GOOGLE', '', () => {
            
        });        
    }

    render() {
        return(
            <div className="sign-in-ui">
                <Modal { ...this.props } renderSignInLogo={true} title="Sign in" wdt={350}>
                    <div id="g-signin2" className="g-signin2 login-space-bottom" data-onsuccess="onGoogleSignIn">
                    </div>
                    <a href="#" className="login-base-button facebook-login login-space-bottom" onClick={ e => this.signInWithFacebook() }>Sign in with Facebook</a>
                    <a href="#" className="login-base-button twitter-login" onClick={ e => this.signInLinkedin() }>Sign in with Linkedin</a>
                </Modal>
            </div>
        )
    }
}

export default connect(null, { signIn })(SignIn);
