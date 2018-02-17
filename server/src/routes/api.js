/* jshint node: true */
'use strict';

import express from 'express';
const router = express.Router({ mergeParams: true });

import AuthorizationController from '../controllers/AuthorizationController';
import SignInController from '../controllers/SignInController';
import RoomsController from '../controllers/RoomsController';
import SettingsController from '../controllers/SettingsController';

router.post('/signin', SignInController.logUser);

router.get('/', (req, res, next) => {
  	res.json({
  		data: 'TBD info about api display all endpoints'
  	});
});

router.use(AuthorizationController.validateSignature);

router.post('/chat-room', RoomsController.createRoom);

router.get('/account/media-settings', SettingsController.getMediaSettings);

router.put('/account/media-settings', SettingsController.updateMediaSettings);

router.delete('/account', SignInController.removeAccount);


router.use('*', (req, res, next) => {
	res.json({
		data: '404 endpoint'
	});
});


export default router;



