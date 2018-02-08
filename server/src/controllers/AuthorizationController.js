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
		}
	}

	// retrive user by id
	static getUserById(userId, select = '_id name photo email role') {
		return User.findById(userId, select);
	}

}

export default AuthorizationController;
