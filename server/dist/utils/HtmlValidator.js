'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _striptags = require('striptags');

var _striptags2 = _interopRequireDefault(_striptags);

var _autolinker = require('autolinker');

var _autolinker2 = _interopRequireDefault(_autolinker);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var instance = void 0;

var HtmlValidator = function () {
    function HtmlValidator() {
        _classCallCheck(this, HtmlValidator);
    }
    //this._autoLinker = new Autolinker();


    // remove all tags


    _createClass(HtmlValidator, null, [{
        key: 'removeAllTags',
        value: function removeAllTags(html) {
            if (html && _lodash2.default.isString(html)) {
                return (0, _striptags2.default)(html);
            }
            return '';
        }

        // convert text links to html a

    }, {
        key: 'linkify',
        value: function linkify(text) {
            if (text && _lodash2.default.isString(text)) {
                return _autolinker2.default.link(text, {
                    newWindow: true,
                    truncate: 30
                });
            }
            return '';
        }
    }, {
        key: 'validateMaxLength',
        value: function validateMaxLength(text) {
            var maxChars = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3000;

            if (text && _lodash2.default.isString(text)) {
                return text.substring(0, maxChars);
            }
            return text;
        }
    }, {
        key: 'getInstance',
        value: function getInstance() {
            if (!instance) {
                instance = new HtmlValidator();
            }
            return instance;
        }
    }]);

    return HtmlValidator;
}();

exports.default = HtmlValidator;