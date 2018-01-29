/* jshint node: true */
'use strict';

import { USER_TOKEN_SECRET } from '../config';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import debugPck from 'debug';
const debug = debugPck('TheLoop:JWT');

class JWT {
	constructor() {}

	static createUserToken(userId) {
		return jwt.sign({
			userId: userId
		}, USER_TOKEN_SECRET);
	}

	static isValidToken(token) {
		let decoded = false;
		try {
		  decoded = jwt.verify(token, USER_TOKEN_SECRET);
		} catch(err) {
		  decoded = false;
		}		
		return decoded;
	}
		
}

export default JWT;