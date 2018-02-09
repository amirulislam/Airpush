/* jshint node: true */
'use strict';

import LE from 'letsencrypt-express';
import { LETS_ENCRYPT_CONFIG } from '../config';

const server = (process.env.NODE_ENV === 'production' || process.env.STAGING === 'yes') ? 'https://acme-v01.api.letsencrypt.org/directory' : 'staging';

const https = app => {
	return LE.create({
		server: server,
		email: LETS_ENCRYPT_CONFIG.email,
		agreeTos: true,
		approvedDomains: LETS_ENCRYPT_CONFIG.approvedDomains,
		app: app
	}).listen(80, 443);
};

export default https;