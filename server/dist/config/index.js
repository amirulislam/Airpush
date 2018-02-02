'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var USER_ROLES = exports.USER_ROLES = {
    PLATFORM_USER: 'PLATFORM_USER'
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
    USER_LEAVED: 'USER_LEAVED'
};