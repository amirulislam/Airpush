/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LinkedInService = function () {
	function LinkedInService() {
		_classCallCheck(this, LinkedInService);
	}

	_createClass(LinkedInService, null, [{
		key: 'getUser',


		// retrive user
		value: function getUser(authToken) {
			return new Promise(function (resolve, reject) {
				var headers = {
					'oauth_token': authToken
				};
				var path = '/v1/people/~:(id,firstName,lastName,emailAddress,picture-url)?format=json';

				var options = {
					hostname: 'api.linkedin.com',
					port: 443,
					path: path,
					method: 'GET',
					headers: headers
				};
				var req = _https2.default.request(options, function (res) {
					if (res.statusCode != 200) {
						reject(new Error('could not verify linkedin account'));
					}

					var dataBuffer = '';
					var linkedInDataResponse = {};

					res.on('end', function () {
						try {
							linkedInDataResponse = JSON.parse(dataBuffer);
						} catch (e) {
							reject(e);
						}
						resolve(linkedInDataResponse);
					});

					res.on('data', function (chunk) {
						dataBuffer += chunk;
					});
				});
				req.end();

				req.on('error', function (e) {
					reject(new Error('could not verify linkedin account'));
				});
			});
		}
	}]);

	return LinkedInService;
}();

exports.default = LinkedInService;