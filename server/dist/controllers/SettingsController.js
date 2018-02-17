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

var _BaseController2 = require('./BaseController');

var _BaseController3 = _interopRequireDefault(_BaseController2);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debug = (0, _debug2.default)('airpush:SettingsController');

var SettingsController = function (_BaseController) {
    _inherits(SettingsController, _BaseController);

    function SettingsController() {
        _classCallCheck(this, SettingsController);

        return _possibleConstructorReturn(this, (SettingsController.__proto__ || Object.getPrototypeOf(SettingsController)).apply(this, arguments));
    }

    _createClass(SettingsController, null, [{
        key: 'getMediaSettings',


        // get media settings
        value: function getMediaSettings(req, res, next) {
            _User2.default.findById(req.userData._id).select({ mediaSettings: 1 }).then(function (user) {
                if (user && user.mediaSettings) {
                    _BaseController3.default.response(res, user);
                } else {
                    SignInController.errorResponse(res, '');
                }
            }).catch(function (err) {
                return SignInController.errorResponse(res, '');
            });
        }

        // update media settings

    }, {
        key: 'updateMediaSettings',
        value: function updateMediaSettings(req, res, next) {

            _User2.default.findOneAndUpdate({
                _id: req.userData._id
            }, {
                mediaSettings: {
                    camState: req.body.camState,
                    micState: req.body.micState
                }
            }, {
                new: true, upsert: true
            }).then(function (user) {
                _BaseController3.default.response(res, {});
            }).catch(function (err) {
                return SignInController.errorResponse(res, '');
            });
        }
    }]);

    return SettingsController;
}(_BaseController3.default);

exports.default = SettingsController;