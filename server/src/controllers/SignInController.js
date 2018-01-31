/* jshint node: true */
'use strict';
import debugPck from 'debug';
const debug = debugPck('airpush:SignInController');
import _ from 'lodash';
import safe from 'undefsafe';
import GoogleService from '../services/GoogleService';
import User from '../models/User';
import JWT from '../utils/JWT';

class SignInController {

    static logUser(req, res, next) {
        GoogleService.verify(req.body.accessToken, req.body.email)
        .then(result => {
            User.findOneAndUpdate({
                email: result.email
            }, result, {
                new: true, upsert: true
            })
            .then(user => {
                if (!_.isNil(user)) {
                    SignInController.response(res, {
                        user, token: JWT.createUserToken(user._id)
                    });
                }
            })
        })
        .catch(e => {
			return res.status(403).json({
				message: 'Not authorizied to see this',
				status: 403
			});	
        });
    }

    static response(res, data) {
        res.status(200).json({
            data,
            links: {
                _self: '/api/signin'
            },
            meta: {}
        }); 
    }
}

export default SignInController;
