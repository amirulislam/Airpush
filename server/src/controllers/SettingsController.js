'use strict';
import debugPck from 'debug';
const debug = debugPck('airpush:SettingsController');
import _ from 'lodash';
import safe from 'undefsafe';
import BaseController from './BaseController';
import User from '../models/User';

class SettingsController extends BaseController {

    // get media settings
    static getMediaSettings(req, res, next) {
        User.findById(req.userData._id)
        .select({ mediaSettings: 1 })
        .then(user => {
            if (user && user.mediaSettings) {
                BaseController.response(res, user);
            } else {
                SignInController.errorResponse(res, '');
            }
        })
        .catch(err => SignInController.errorResponse(res, ''));
    }

    // update media settings
    static updateMediaSettings(req, res, next) {

        User.findOneAndUpdate({
            _id: req.userData._id
        }, {
            mediaSettings: {
                camState: req.body.camState,
                micState: req.body.micState
            }
        }, {
            new: true, upsert: true
        })
        .then(user => {
            BaseController.response(res, {});
        })
        .catch(err => SignInController.errorResponse(res, ''));
    }    
}

export default SettingsController;
