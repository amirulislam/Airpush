/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _AuthorizationController = require('../controllers/AuthorizationController');

var _AuthorizationController2 = _interopRequireDefault(_AuthorizationController);

var _SignInController = require('../controllers/SignInController');

var _SignInController2 = _interopRequireDefault(_SignInController);

var _RoomsController = require('../controllers/RoomsController');

var _RoomsController2 = _interopRequireDefault(_RoomsController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router({ mergeParams: true });

router.post('/signin', _SignInController2.default.logUser);

router.get('/', function (req, res, next) {
  res.json({
    data: 'TBD info about api display all endpoints'
  });
});

router.use(_AuthorizationController2.default.validateSignature);

router.post('/chat-room', _RoomsController2.default.createRoom);

router.use('*', function (req, res, next) {
  res.json({
    data: '404 endpoint'
  });
});

exports.default = router;