export const ROUTES = {
    ROOT: '/app',
    // MAIN: '/app/main',
    SIGN_IN: '/app/signin',
    // WELCOME: '/app/welcome',
    MY_ACCOUNT: '/app/my-account',
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
    USER_DISCOVER_SIGNAL: 'USER_DISCOVER_SIGNAL',
    USER_LEAVED: 'USER_LEAVED',
    TEXT_MESSAGE: 'TEXT_MESSAGE',
    ACCEPT_FILE_MESSAGE: 'ACCEPT_FILE_MESSAGE',
    INTERNAL_MESSAGE_OFFER: 'INTERNAL_MESSAGE_OFFER',
    PEER_SIGNAL: 'PEER_SIGNAL',
    PEER_SIGNAL_ANSWER: 'PEER_SIGNAL_ANSWER',
    PEER_SIGNAL_ICE: 'PEER_SIGNAL_ICE',
    PEER_SIGNAL_IM_READY: 'PEER_SIGNAL_IM_READY',
    SOCKET_STATE: 'SOCKET_STATE'
}

export const PEER_TYPES = {
    FILE_TRANSPORT: 'FILE_TRANSPORT'
}

