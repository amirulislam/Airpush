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

var FacebookService = function () {
	function FacebookService() {
		_classCallCheck(this, FacebookService);
	}

	_createClass(FacebookService, null, [{
		key: 'verify',
		value: function verify(authToken) {
			var graphPath = '/me?fields=id,name,first_name,last_name,picture,email&access_token=' + authToken;
			return FacebookService.getUser(graphPath);
		}

		// retrive user

	}, {
		key: 'getUser',
		value: function getUser(graphPath) {
			return new Promise(function (resolve, reject) {

				var path = graphPath;

				var options = {
					hostname: 'graph.facebook.com',
					port: 443,
					path: path,
					method: 'GET'
				};
				var req = _https2.default.request(options, function (res) {
					if (res.statusCode != 200) {
						reject(new Error('could not verify facebook account'));
					}

					var dataBuffer = '';
					var facebookDataResponse = {};

					res.on('end', function () {
						try {
							facebookDataResponse = JSON.parse(dataBuffer);
						} catch (e) {
							reject(e);
						}
						resolve(facebookDataResponse);
					});

					res.on('data', function (chunk) {
						dataBuffer += chunk;
					});
				});
				req.end();

				req.on('error', function (e) {
					reject(new Error('could not verify facebook account'));
				});
			});
		}
	}]);

	return FacebookService;
}();

exports.default = FacebookService;