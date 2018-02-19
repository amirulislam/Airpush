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

var _LinkedinService = require('../services/LinkedinService');

var _LinkedinService2 = _interopRequireDefault(_LinkedinService);

var _FacebookService = require('../services/FacebookService');

var _FacebookService2 = _interopRequireDefault(_FacebookService);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _JWT = require('../utils/JWT');

var _JWT2 = _interopRequireDefault(_JWT);

var _SlackService = require('../services/SlackService');

var _SlackService2 = _interopRequireDefault(_SlackService);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = (0, _debug2.default)('airpush:SignInController');

// remove this
// const user = {
//     email: "eblocksapps@gmail.com",
//     iat: 1517557279,
//     name: "Eblocks Shopify Apps",
//     photo: "https://lh3.googleusercontent.com/-8MSgQc63eVM/AAAAAAAAAAI/AAAAAAAAAAA/ACSILjXvFAN17fKuukGjHsKuZ81RHP2TRw/s96-c/photo.jpg",
//     _id: "5a74161feddff24834fbaf88",
//     msgType: "NEW_USER_JOINED"
// }


var SignInController = function () {
    function SignInController() {
        _classCallCheck(this, SignInController);
    }

    _createClass(SignInController, null, [{
        key: 'logUser',
        value: function logUser(req, res, next) {
            switch (req.body.strategy) {
                case 'GOOGLE':
                    SignInController.googleSignIn(req.body.accessToken, req.body.email).then(function (user) {
                        return SignInController.signTokenAndRespond(user, res);
                    }).catch(function (err) {
                        return SignInController.errorResponse(res, '');
                    });
                    break;
                case 'LINKEDIN':
                    SignInController.linkedinSignIn(req.body.accessToken, req.body.email).then(function (user) {
                        return SignInController.signTokenAndRespond(user, res);
                    }).catch(function (err) {
                        return SignInController.errorResponse(res, '');
                    });
                    break;
                case 'FACEBOOK':
                    SignInController.facebookSignIn(req.body.accessToken, req.body.userID).then(function (user) {
                        return SignInController.signTokenAndRespond(user, res);
                    }).catch(function (err) {
                        return SignInController.errorResponse(res, '');
                    });
                    break;
                default:
                    SignInController.errorResponse(res, 'Not authorizied to see this', 403);
            }
        }
    }, {
        key: 'facebookSignIn',
        value: function facebookSignIn(accessToken, userId) {
            return _FacebookService2.default.verify(accessToken).then(function (fbResult) {
                if (userId === fbResult.id) {
                    var photoUrl = '';
                    if (fbResult.picture && fbResult.picture.data) {
                        photoUrl = fbResult.picture.data.url;
                    }
                    var user = {
                        name: fbResult.first_name + ' ' + fbResult.last_name,
                        email: fbResult.email || String(fbResult.id),
                        photo: photoUrl
                    };
                    return SignInController.slackNotify(user.email, user).then(function (existingUser) {
                        return SignInController.updateOrCreateUser(user, existingUser);
                    });
                } else {
                    return Promise.reject({});
                }
            });
        }

        // linkedin sign in

    }, {
        key: 'linkedinSignIn',
        value: function linkedinSignIn(accessToken, email) {
            return _LinkedinService2.default.getUser(accessToken).then(function (linkedinUser) {
                if (!_lodash2.default.isNil(linkedinUser)) {
                    var user = {
                        name: linkedinUser.firstName + ' ' + linkedinUser.lastName,
                        email: linkedinUser.emailAddress,
                        photo: linkedinUser.pictureUrl
                    };
                    return SignInController.slackNotify(user.email, user).then(function (existingUser) {
                        return SignInController.updateOrCreateUser(user, existingUser);
                    });
                } else {
                    Promise.reject({});
                }
            });
        }

        // google sign in

    }, {
        key: 'googleSignIn',
        value: function googleSignIn(accessToken, email) {
            return _GoogleService2.default.verify(accessToken, email).then(function (result) {
                return SignInController.slackNotify(email, result).then(function (existingUser) {
                    return SignInController.updateOrCreateUser(result, existingUser);
                });
            });
        }

        // get user by email

    }, {
        key: 'slackNotify',
        value: function slackNotify(email, candidate) {
            return _User2.default.findOne({ email: email }).then(function (user) {
                if (_lodash2.default.isNil(user)) {
                    debug('SLACK NOTYFY !!!!');
                    _SlackService2.default.notifyNewUser(candidate);
                }
                return user;
            });
        }

        // update or create user

    }, {
        key: 'updateOrCreateUser',
        value: function updateOrCreateUser(user, existingUser) {
            if (_lodash2.default.isObject(user)) {
                user.role = (0, _config.getUserRole)(user.email);
                user.socketInfo = {
                    socketId: '',
                    connected: false
                };
                if (!existingUser) {
                    user.mediaSettings = {
                        camState: true,
                        micState: true
                    };
                    user.createdAt = Date.now();
                }
            }
            return _User2.default.findOneAndUpdate({
                email: user.email
            }, user, {
                new: true, upsert: true
            });
        }
    }, {
        key: 'signTokenAndRespond',
        value: function signTokenAndRespond(user, res) {
            if (!_lodash2.default.isNil(user)) {
                SignInController.response(res, {
                    user: user, token: _JWT2.default.createUserToken(user)
                });
            }
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

        // general 200 response

    }, {
        key: 'response',
        value: function response(res, data) {
            res.set('x-no-compression', 'true');
            if (_lodash2.default.isObject(data)) {
                data._x_turn_temp_auth = _JWT2.default.getSignerTurnCredidentials();
            }
            res.status(200).json({
                data: data,
                links: {
                    _self: '/api/signin'
                },
                meta: {}
            });
        }
    }, {
        key: 'errorResponse',
        value: function errorResponse(res) {
            var errMsg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
            var code = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 500;

            return res.status(code).json({
                message: errMsg,
                status: code
            });
        }
    }]);

    return SignInController;
}();

exports.default = SignInController;