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

var _GoogleService = require('../services/GoogleService');

var _GoogleService2 = _interopRequireDefault(_GoogleService);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _JWT = require('../utils/JWT');

var _JWT2 = _interopRequireDefault(_JWT);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = (0, _debug2.default)('airpush:SignInController');


// remove this
var user = {
    email: "eblocksapps@gmail.com",
    iat: 1517557279,
    name: "Eblocks Shopify Apps",
    photo: "https://lh3.googleusercontent.com/-8MSgQc63eVM/AAAAAAAAAAI/AAAAAAAAAAA/ACSILjXvFAN17fKuukGjHsKuZ81RHP2TRw/s96-c/photo.jpg",
    _id: "5a74161feddff24834fbaf88",
    msgType: "NEW_USER_JOINED"
};

var SignInController = function () {
    function SignInController() {
        _classCallCheck(this, SignInController);
    }

    _createClass(SignInController, null, [{
        key: 'logUser',
        value: function logUser(req, res, next) {
            _GoogleService2.default.verify(req.body.accessToken, req.body.email).then(function (result) {
                _User2.default.findOneAndUpdate({
                    email: result.email
                }, result, {
                    new: true, upsert: true
                }).then(function (user) {
                    if (!_lodash2.default.isNil(user)) {
                        SignInController.response(res, {
                            user: user, token: _JWT2.default.createUserToken(user)
                        });
                    }
                });
            }).catch(function (e) {
                return res.status(403).json({
                    message: 'Not authorizied to see this',
                    status: 403
                });
            });
        }
    }, {
        key: 'response',
        value: function response(res, data) {
            res.status(200).json({
                data: data,
                links: {
                    _self: '/api/signin'
                },
                meta: {}
            });
        }

        // remove account

    }, {
        key: 'removeAccount',
        value: function removeAccount(req, res, next) {
            _User2.default.remove({
                email: req.userData.email
            }).then(function (u) {
                SignInController.response(res, {});
            }).catch(function (err) {
                return res.status(500).json({
                    message: 'Could not remove the account',
                    status: 500
                });
            });
        }
    }]);

    return SignInController;
}();

exports.default = SignInController;