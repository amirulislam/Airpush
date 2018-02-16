'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var USER_ROLES = exports.USER_ROLES = {
    PLATFORM_USER: 'PLATFORM_USER',
    DEV_OPS: 'DEV_OPS',
    ADMIN: 'ADMIN'
};

var USER_TOKEN_SECRET = exports.USER_TOKEN_SECRET = '123749823%@$#7234VBJSQKJSQJHJHSJS&^%^***ewhrh';

var SOCKET_EVENTS = exports.SOCKET_EVENTS = {
    CREATE_ROOM: 'CREATE_ROOM',
    ROOM_CREATED: 'ROOM_CREATED',
    JOINED_ROOM: 'JOINED_ROOM',
    JOIN_ROOM: 'JOIN_ROOM',
    LEAVE_ROOM: 'LEAVE_ROOM',
    DISCONNECT: 'disconnect',
    CONNECT: 'connect',
    MESSAGE: 'MESSAGE',
    SIGNAL: 'SIGNAL',
    USER_LEFT: 'USER_LEFT',
    ERROR: 'error'
};

var SOCKET_MESSAGE_TYPES = exports.SOCKET_MESSAGE_TYPES = {
    NEW_USER_JOINED: 'NEW_USER_JOINED',
    USER_DISCOVER_SIGNAL: 'USER_DISCOVER_SIGNAL',
    USER_LEAVED: 'USER_LEAVED',
    TEXT_MESSAGE: 'TEXT_MESSAGE',
    ACCEPT_FILE_MESSAGE: 'ACCEPT_FILE_MESSAGE',
    PEER_SIGNAL: 'PEER_SIGNAL',
    PEER_SIGNAL_ANSWER: 'PEER_SIGNAL_ANSWER',
    PEER_SIGNAL_ICE: 'PEER_SIGNAL_ICE',
    PEER_SIGNAL_IM_READY: 'PEER_SIGNAL_IM_READY',
    SOCKET_STATE: 'SOCKET_STATE',
    ROOM_FOOL_ERROR: 'ROOM_FOOL_ERROR',
    ALREADY_CONNECTED_ERROR: 'ALREADY_CONNECTED_ERROR'
};

var IS_PRODUCTION = exports.IS_PRODUCTION = process.env.NODE_ENV === 'production' ? true : false;

// letsencrypt config
var getLetsEncryptConfig = function getLetsEncryptConfig() {
    return IS_PRODUCTION ? {
        email: 'crisu.ionel@gmail.com',
        approvedDomains: ['airpush.io']
    } : {
        email: 'crisu.ionel@gmail.com',
        approvedDomains: ['127.0.0.1']
    };
};
var LETS_ENCRYPT_CONFIG = exports.LETS_ENCRYPT_CONFIG = getLetsEncryptConfig();

var GOOGLE_CLIENT_ID = exports.GOOGLE_CLIENT_ID = '540129414870-dm5d15e5768bl039hbmu4gabfer70ciq.apps.googleusercontent.com';

var SLACK_NOTIFY = exports.SLACK_NOTIFY = {
    webhook: 'https://hooks.slack.com/services/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',
    chanel: '#airpush'
};

var OPPS_USERS = ['crisu.ionel@gmail.com'];

var getUserRole = exports.getUserRole = function getUserRole(email) {
    if (!email) {
        return USER_ROLES.PLATFORM_USER;
    }
    var role = USER_ROLES.PLATFORM_USER;
    for (var i = 0; i < OPPS_USERS.length; i++) {
        if (OPPS_USERS[i] === email) {
            role = USER_ROLES.DEV_OPS;
            break;
        }
    }
    return role;
};

var CHAT_ROOM_MAX_CLIENTS = exports.CHAT_ROOM_MAX_CLIENTS = 6;