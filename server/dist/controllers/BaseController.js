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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = (0, _debug2.default)('airpush:SettingsController');

var BaseController = function () {
    function BaseController() {
        _classCallCheck(this, BaseController);
    }

    _createClass(BaseController, null, [{
        key: 'response',

        // general 200 response
        value: function response(res, data) {
            res.set('x-no-compression', 'true');
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

    return BaseController;
}();

exports.default = BaseController;