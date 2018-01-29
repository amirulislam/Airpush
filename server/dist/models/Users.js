/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var UserSchema = new Schema({
	email: { type: String, required: true, index: { unique: true } },
	name: { type: String, required: false },
	lang: { type: String, default: 'en' },
	password: { type: String },
	emailValidated: { type: Boolean, default: false },
	role: { type: String, default: _config.USER_ROLES.ORGANIZTION_OWNER }
});

exports.default = _mongoose2.default.model('User', UserSchema);