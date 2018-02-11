'use strict';

import _ from 'lodash';
import https from 'https';

class FacebookService {

	static verify(authToken) {
		let graphPath = '/me?fields=id,name,first_name,last_name,picture,email&access_token=' + authToken;		
		return FacebookService.getUser(graphPath);
	}

	// retrive user
	static getUser(graphPath) {
		return new Promise((resolve, reject) => {

			let path = graphPath;

			let options = {
			  hostname: 'graph.facebook.com',
			  port: 443,
			  path: path,
			  method: 'GET'
			};
			let req = https.request(options, (res) => {
				if (res.statusCode != 200) {
					reject(new Error('could not verify facebook account'));
				}

				let dataBuffer = '';
				let facebookDataResponse = {};

				res.on('end', function () {
					try {
						facebookDataResponse = JSON.parse(dataBuffer);
					} catch (e) {
						reject(e);
					}
					resolve(facebookDataResponse);
				});

			  	res.on('data', (chunk) => {
			  		dataBuffer += chunk;
			  	});
			});
			req.end();

			req.on('error', (e) => {
			  reject(new Error('could not verify facebook account'));
			});

		});
	}

}

export default FacebookService;
