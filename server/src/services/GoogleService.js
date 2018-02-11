/* jshint node: true */
'use strict';

import _ from 'lodash';
import safe from 'undefsafe';
const { OAuth2Client } = require('google-auth-library');
import { GOOGLE_CLIENT_ID } from '../config';

class GoogleService {

	// retrive user
	static verify(authToken, email) {
        const oAuth2Client = new OAuth2Client(
            GOOGLE_CLIENT_ID
        );
        return oAuth2Client.verifyIdToken({idToken: authToken})
        .then(LoginTicket => {
            // console.log('Result', LoginTicket);
            if (!_.isNil(safe(LoginTicket, 'payload.email')) && LoginTicket.payload.email === email) {
                return {
                    email: LoginTicket.payload.email,
                    name: LoginTicket.payload.name,
                    photo: LoginTicket.payload.picture,
                    strategy: 'GOOGLE'
                }
            } else {
                return Promise.reject("Invalid token");
            }
        })
	}

}

export default GoogleService;
