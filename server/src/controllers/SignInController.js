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
        switch(req.body.strategy) {
            case 'GOOGLE':
                SignInController.googleSignIn(req.body.accessToken, req.body.email)
                .then(user => SignInController.signTokenAndRespond(user, res))
                .catch(err => SignInController.errorResponse(res, ''))
                break;
            default:
                SignInController.errorResponse(res, 'Not authorizied to see this', 403);
        }
    }

    // google sign in
    static googleSignIn(accessToken, email) {
        return GoogleService.verify(accessToken, email)
        .then(result => {
            return SignInController.slackNotify(email)
            .then(() => {
                return SignInController.updateOrCreateUser(result);
            });
        })        
    }

    // get user by email
    static slackNotify(email) {
        return User.findOne({email})
        .then(user => {
            if (_.isNil(user)) {
                debug('SLACK NOTYFY !!!!')
            }
            return;
        })
    }

    // update or create user
    static updateOrCreateUser(user) {
        return User.findOneAndUpdate({
            email: user.email
        }, user, {
            new: true, upsert: true
        });
    }

    static signTokenAndRespond(user, res) {
        if (!_.isNil(user)) {
            SignInController.response(res, {
                user, token: JWT.createUserToken(user)
            });
        }
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

    // general 200 response
    static response(res, data) {
        res.status(200).json({
            data,
            links: {
                _self: '/api/signin'
            },
            meta: {}
        }); 
    }
    
    static errorResponse(res, errMsg = '', code = 500) {
        return res.status(code).json({
            message: errMsg,
            status: code
        });        
    }
}

export default SignInController;
