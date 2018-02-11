/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _undefsafe = require('undefsafe');

var _undefsafe2 = _interopRequireDefault(_undefsafe);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('google-auth-library'),
    OAuth2Client = _require.OAuth2Client;

var GoogleService = function () {
    function GoogleService() {
        _classCallCheck(this, GoogleService);
    }

    _createClass(GoogleService, null, [{
        key: 'verify',


        // retrive user
        value: function verify(authToken, email) {
            var oAuth2Client = new OAuth2Client(_config.GOOGLE_CLIENT_ID);
            return oAuth2Client.verifyIdToken({ idToken: authToken }).then(function (LoginTicket) {
                // console.log('Result', LoginTicket);
                if (!_lodash2.default.isNil((0, _undefsafe2.default)(LoginTicket, 'payload.email')) && LoginTicket.payload.email === email) {
                    return {
                        email: LoginTicket.payload.email,
                        name: LoginTicket.payload.name,
                        photo: LoginTicket.payload.picture,
                        strategy: 'GOOGLE'
                    };
                } else {
                    return Promise.reject("Invalid token");
                }
            });
        }
    }]);

    return GoogleService;
}();

exports.default = GoogleService;