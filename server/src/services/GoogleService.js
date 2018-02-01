/* jshint node: true */
'use strict';

import _ from 'lodash';
import safe from 'undefsafe';
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '540129414870-dm5d15e5768bl039hbmu4gabfer70ciq.apps.googleusercontent.com	';

class GoogleService {

	// retrive user
	static verify(authToken, email) {
        const oAuth2Client = new OAuth2Client(
            CLIENT_ID
        );
        return oAuth2Client.verifyIdToken({idToken: authToken})
        .then(LoginTicket => {
            // console.log('Result', LoginTicket);
            if (!_.isNil(safe(LoginTicket, 'payload.email')) && LoginTicket.payload.email === email) {
                return {
                    email: LoginTicket.payload.email,
                    name: LoginTicket.payload.name,
                    photo: LoginTicket.payload.picture
                }
            } else {
                return Promise.reject("Invalid token");
            }
        })
	}

}

export default GoogleService;
