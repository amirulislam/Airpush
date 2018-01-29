/* jshint node: true */
'use strict';

import express from 'express';
const router = express.Router({ mergeParams: true });

import Authorization from '../controllers/authorization';
import SignInController from '../controllers/SignInController';

router.post('/signin', SignInController.logUser);

router.get('/', (req, res, next) => {
  	res.json({
  		data: 'TBD info about api display all endpoints'
  	});
});

router.use('*', (req, res, next) => {
	res.json({
		data: '404 endpoint'
	});
});

router.use(Authorization.validateSignature);

export default router;



