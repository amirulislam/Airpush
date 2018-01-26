/* jshint node: true */
'use strict';

import express from 'express';
const router = express.Router({ mergeParams: true });

import Authorization from '../controllers/authorization';

router.get('/', (req, res, next) => {
  	res.json({
  		data: 'TBD info about api display all endpoints'
  	});
});

router.use(Authorization.validateSignature);

export default router;



