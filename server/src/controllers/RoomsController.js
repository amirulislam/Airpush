/* jshint node: true */
'use strict';
import debugPck from 'debug';
const debug = debugPck('airpush:SignInController');
import _ from 'lodash';
import safe from 'undefsafe';

class RoomsController {
    // create new chat room
    static createRoom(req, res, next) {
        res.json({status: 'OK'});
    }
}

export default RoomsController;
