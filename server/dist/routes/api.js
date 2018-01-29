/* jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _authorization = require('../controllers/authorization');

var _authorization2 = _interopRequireDefault(_authorization);

var _SignInController = require('../controllers/SignInController');

var _SignInController2 = _interopRequireDefault(_SignInController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router({ mergeParams: true });

router.post('/signin', _SignInController2.default.logUser);

router.get('/', function (req, res, next) {
  res.json({
    data: 'TBD info about api display all endpoints'
  });
});

router.use('*', function (req, res, next) {
  res.json({
    data: '404 endpoint'
  });
});

router.use(_authorization2.default.validateSignature);

exports.default = router;