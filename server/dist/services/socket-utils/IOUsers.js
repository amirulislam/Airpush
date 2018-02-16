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
            if (!this.userExists(user)) {
                this._users[user._id] = user;
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
                this._logAllUsers();
            }
        }
    }, {
        key: 'userExists',
        value: function userExists(user) {
            if (!user) {
                return false;
            }
            return this._users[user._id] ? this._users[user._id] : false;
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
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this._users[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var user = _step.value;

                    console.log('User id:::>>>', user);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }], [{
        key: 'getInstance',
        value: function getInstance() {
            if (!instance) {
                instance = new SocketIOUsers(UNIQUE_SIGNATURE);
            }
            return instance;
        }
    }]);

    return SocketIOUsers;
}();

exports.default = SocketIOUsers;