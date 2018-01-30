/* jshint node: true */
'use strict';

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import { USER_ROLES } from '../config';

const UserSchema = new Schema({	
	email: { type: String, required: true, index: { unique: true } },
	name: { type: String, required: false, default: '' },
	photo: { type: String, required: false, default: '' },
	role: { type: String, default: USER_ROLES.PLATFORM_USER }
});

export default mongoose.model('User', UserSchema);
