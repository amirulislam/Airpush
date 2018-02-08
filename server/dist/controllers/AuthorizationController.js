/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _undefsafe = require('undefsafe');

var _undefsafe2 = _interopRequireDefault(_undefsafe);

var _JWT = require('../utils/JWT');

var _JWT2 = _interopRequireDefault(_JWT);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = (0, _debug2.default)('airpush:Authorization');

var AuthorizationController = function () {
	function AuthorizationController() {
		_classCallCheck(this, AuthorizationController);
	}

	_createClass(AuthorizationController, null, [{
		key: 'validateSignature',
		value: function validateSignature(req, res, next) {
			var decoded = _JWT2.default.isValidToken(req.headers.x__authorization);
			if (decoded === false) {
				return res.status(403).json({ status: 'FAIL', message: 'Access forbidden!' });
			}
			if (!_lodash2.default.isNil((0, _undefsafe2.default)(decoded, '_id'))) {
				req.userData = decoded;
				next();
			}
		}

		// retrive user by id

	}, {
		key: 'getUserById',
		value: function getUserById(userId) {
			var select = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '_id name photo email role';

			return _User2.default.findById(userId, select);
		}
	}]);

	return AuthorizationController;
}();

exports.default = AuthorizationController;