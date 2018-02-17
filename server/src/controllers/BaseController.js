'use strict';
import debugPck from 'debug';
const debug = debugPck('airpush:SettingsController');
import _ from 'lodash';
import safe from 'undefsafe';

class BaseController {
    // general 200 response
    static response(res, data) {
        res.set('x-no-compression', 'true');
        res.status(200).json({
            data,
            links: {
                _self: '/api/signin'
            },
            meta: {}
        }); 
    }
    
    static errorResponse(res, errMsg = '', code = 500) {
        return res.status(code).json({
            message: errMsg,
            status: code
        });        
    }
}

export default BaseController;
