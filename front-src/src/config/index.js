export const ROUTES = {
    ROOT: '/app',
    MAIN: '/app/main',
    SIGN_IN: '/app/signin',
    WELCOME: '/app/welcome',
    CHAT_ROOM: '/app/chat'
}

export const MENU_WIDTH = '250px';

export const SOCKET_EVENTS = {
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
}

export const SOCKET_MESSAGE_TYPES = {
    NEW_USER_JOINED: 'NEW_USER_JOINED',
    USER_LEAVED: 'USER_LEAVED',
    TEXT_MESSAGE: 'TEXT_MESSAGE',
    PEER_SIGNAL: 'PEER_SIGNAL'
}

