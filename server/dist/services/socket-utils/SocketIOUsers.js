'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var instance = void 0;
var UNIQUE_SIGNATURE = 'sahdiosd238u23u*&';

var SocketIOUsers = function () {
    function SocketIOUsers(signature) {
        _classCallCheck(this, SocketIOUsers);

        this._users = {};

        if (signature !== UNIQUE_SIGNATURE) {
            throw new Error('You can not instantiate like this');
        }
    }

    _createClass(SocketIOUsers, [{
        key: 'addUser',
        value: function addUser(user) {
            if (user && !this.userExists(user)) {
                this._users[user._id] = user;
                console.log('user added');
                this._logAllUsers();
                return user;
            }
            return false;
        }
    }, {
        key: 'removeUser',
        value: function removeUser(user) {
            if (this.userExists(user)) {
                delete this._users[user._id];
                console.log('user removed');
                this._logAllUsers();
            }
        }
    }, {
        key: 'userExists',
        value: function userExists(user) {
            console.log('TESTTTTTT', this.test);
            if (!user) {
                return false;
            }
            var userExists = this._users[user._id] ? this._users[user._id] : false;
            return userExists;
        }
    }, {
        key: 'removeAll',
        value: function removeAll() {
            this._users = {};
        }

        // for testing purposes

    }, {
        key: '_logAllUsers',
        value: function _logAllUsers() {
            console.log('\n\n\n\n\nUsers :::>>>', this._users, '\n END Users :::>>>\n\n\n\n');
        }
    }], [{
        key: 'getInstance',
        value: function getInstance(test) {
            if (!instance) {
                instance = new SocketIOUsers(UNIQUE_SIGNATURE);
                instance.test = test;
            }
            return instance;
        }
    }]);

    return SocketIOUsers;
}();

exports.default = SocketIOUsers;