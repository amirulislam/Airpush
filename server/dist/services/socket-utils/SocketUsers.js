'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var instance = void 0;
var UNIQUE_SIGNATURE = 'sahdiosd238u23u*&';

var IOUsers = function () {
    function IOUsers(signature) {
        _classCallCheck(this, IOUsers);

        this._users = {};

        if (signature !== UNIQUE_SIGNATURE) {
            throw new Error('You can not instantiate like this');
        }
    }

    _createClass(IOUsers, [{
        key: 'addUser',
        value: function addUser(user) {
            if (!this.userExists(user)) {
                this._users[user._id] = user;
            }
        }
    }, {
        key: 'removeUser',
        value: function removeUser(user) {
            if (this.userExists(user)) {
                delete this._users[user._id];
            }
        }
    }, {
        key: 'userExists',
        value: function userExists(user) {
            return this._users[user._id] ? true : false;
        }
    }, {
        key: 'removeAll',
        value: function removeAll() {
            this._users = {};
        }
    }], [{
        key: 'getInstance',
        value: function getInstance() {
            if (!instance) {
                instance = new IOUsers(UNIQUE_SIGNATURE);
            }
            return instance;
        }
    }]);

    return IOUsers;
}();

exports.default = IOUsers;