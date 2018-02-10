/* jshint node: true */
'use strict';
import debugPck from 'debug';
const debug = debugPck('airpush:SignInController');
import _ from 'lodash';
import safe from 'undefsafe';
import GoogleService from '../services/GoogleService';
import User from '../models/User';
import JWT from '../utils/JWT';


// remove this
const user = {
    email: "eblocksapps@gmail.com",
    iat: 1517557279,
    name: "Eblocks Shopify Apps",
    photo: "https://lh3.googleusercontent.com/-8MSgQc63eVM/AAAAAAAAAAI/AAAAAAAAAAA/ACSILjXvFAN17fKuukGjHsKuZ81RHP2TRw/s96-c/photo.jpg",
    _id: "5a74161feddff24834fbaf88",
    msgType: "NEW_USER_JOINED"
}


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
                        user, token: JWT.createUserToken(user)
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

    // remove account
    static removeAccount(req, res, next) {
        User.remove({
            email: req.userData.email
        })
        .then(u => {
            SignInController.response(res, {});
        })
        .catch(err => {
			return res.status(500).json({
				message: 'Could not remove the account',
				status: 500
			});	
        });
    }
}

export default SignInController;
