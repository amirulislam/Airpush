/* jshint node: true */
'use strict';

import debugPck from 'debug';
const debug = debugPck('loop:Authorization');
import _ from 'lodash';
import safe from 'undefsafe';

class Authorization {

	static validateSignature(req, res, next) {
		debug('VALIDATE HERE');
		next();
	}

	// preserve shop data within request
	static useOrganization(req, res, next) {
		
	}

}

export default Authorization;
