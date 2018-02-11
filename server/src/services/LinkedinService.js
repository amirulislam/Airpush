/* jshint node: true */
'use strict';

import _ from 'lodash';
import https from 'https';

class LinkedInService {

	// retrive user
	static getUser(authToken) {
		return new Promise((resolve, reject) => {
			let headers = {
				'oauth_token': authToken
			}
			let path = '/v1/people/~:(id,firstName,lastName,emailAddress,picture-url)?format=json';

			let options = {
			  hostname: 'api.linkedin.com',
			  port: 443,
			  path: path,
			  method: 'GET',
			  headers: headers
			};
			let req = https.request(options, (res) => {
				if (res.statusCode != 200) {
					reject(new Error('could not verify linkedin account'));
				}

				let dataBuffer = '';
				let linkedInDataResponse = {};

				res.on('end', function () {
					try {
						linkedInDataResponse = JSON.parse(dataBuffer);
					} catch (e) {
						reject(e);
					}
					resolve(linkedInDataResponse);
				});

			  	res.on('data', (chunk) => {
			  		dataBuffer += chunk;
			  	});
			});
			req.end();

			req.on('error', (e) => {
			  reject(new Error('could not verify linkedin account'));
			});

		});
	}

}

export default LinkedInService;
