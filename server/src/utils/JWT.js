/* jshint node: true */
'use strict';

import { USER_TOKEN_SECRET, TURN_SERVER_SECRET, RELAY_CREDIDENTIALS } from '../config';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import debugPck from 'debug';
const debug = debugPck('TheLoop:JWT');

class JWT {
	constructor() {}

	static createUserToken(user) {
		return jwt.sign({
			_id: user._id,
			name: user.name,
			email: user.email,
			photo: user.photo
		}, USER_TOKEN_SECRET);
	}

	static getSignerTurnCredidentials() {
		return jwt.sign(RELAY_CREDIDENTIALS, TURN_SERVER_SECRET);		
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