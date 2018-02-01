/* jshint node: true */
'use strict';

import debugPck from 'debug';
const debug = debugPck('airpush:Authorization');
import _ from 'lodash';
import safe from 'undefsafe';
import JWT from '../utils/JWT';
import User from '../models/User';

class AuthorizationController {

	static validateSignature(req, res, next) {
		const decoded = JWT.isValidToken(req.headers.x__authorization);
		if (decoded === false) {
			return res.status(403).json({status: 'FAIL', message: 'Access forbidden!'})
		}
		if (!_.isNil(safe(decoded, '_id'))) {
			req.userData = decoded;
			next();
			// AuthorizationController.getUserById(decoded._id)
			// .then(user => {	
			// 	if (!_.isNil(user)) {
			// 		req.userData = user;
			// 		return next();
			// 	}
			// 	return Promise.reject("Could not find the user");
			// })
			// .catch(e => {
			// 	debug('Error', e);
			// 	return res.status(404).json({
			// 		message: 'Could not find the user',
			// 		status: 403
			// 	});				
			// });
		}
	}

	// retrive user by id
	static getUserById(userId, select = '_id name photo email role') {
		return User.findById(userId, select);
	}

}

export default AuthorizationController;
