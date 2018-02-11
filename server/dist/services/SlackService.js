'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = require('../config');

var _slackNode = require('slack-node');

var _slackNode2 = _interopRequireDefault(_slackNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var slack = new _slackNode2.default();
slack.setWebhook(_config.SLACK_NOTIFY.webhook);

var SlackService = function () {
    function SlackService() {
        _classCallCheck(this, SlackService);
    }

    _createClass(SlackService, null, [{
        key: 'notifyNewUser',
        value: function notifyNewUser(user) {
            if (!user) {
                return;
            }
            slack.webhook({
                channel: "#airpush",
                username: "webhookbot",
                text: 'New user: ' + user.name + ' - ' + user.email
            }, function (err, response) {
                // console.log(response);
            });
        }
    }]);

    return SlackService;
}();

exports.default = SlackService;