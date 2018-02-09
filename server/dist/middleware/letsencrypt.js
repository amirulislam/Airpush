/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _letsencryptExpress = require('letsencrypt-express');

var _letsencryptExpress2 = _interopRequireDefault(_letsencryptExpress);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = process.env.NODE_ENV === 'production' || process.env.STAGING === 'yes' ? 'https://acme-v01.api.letsencrypt.org/directory' : 'staging';

var https = function https(app) {
	return _letsencryptExpress2.default.create({
		server: server,
		email: _config.LETS_ENCRYPT_CONFIG.email,
		agreeTos: true,
		approvedDomains: _config.LETS_ENCRYPT_CONFIG.approvedDomains,
		app: app
	}).listen(80, 443);
};

exports.default = https;