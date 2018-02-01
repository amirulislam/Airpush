/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SocketManager = function SocketManager(io) {
    _classCallCheck(this, SocketManager);

    this._io = io;
};

exports.default = SocketManager;