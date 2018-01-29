/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = require('../config');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = (0, _debug2.default)('TheLoop:JWT');

var JWT = function () {
	function JWT() {
		_classCallCheck(this, JWT);
	}

	_createClass(JWT, null, [{
		key: 'createUserToken',
		value: function createUserToken(userId) {
			return _jsonwebtoken2.default.sign({
				userId: userId
			}, _config.USER_TOKEN_SECRET);
		}
	}, {
		key: 'isValidToken',
		value: function isValidToken(token) {
			var decoded = false;
			try {
				decoded = _jsonwebtoken2.default.verify(token, _config.USER_TOKEN_SECRET);
			} catch (err) {
				decoded = false;
			}
			return decoded;
		}
	}]);

	return JWT;
}();

exports.default = JWT;