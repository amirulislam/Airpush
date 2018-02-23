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
    SOCKET_STATE: 'SOCKET_STATE',
    ROOM_FOOL_ERROR: 'ROOM_FOOL_ERROR',
    ALREADY_CONNECTED_ERROR: 'ALREADY_CONNECTED_ERROR',
    OTHER_CLIENT_USAGE: 'OTHER_CLIENT_USAGE',
    RENEG_OFFER: 'RENEG_OFFER',
    RENEG_ANSWER: 'RENEG_ANSWER',
}

export const PEER_TYPES = {
    FILE_TRANSPORT: 'FILE_TRANSPORT'
}

export const VIDEO_RESOLUTION = {
    small: {
        width: { ideal: 400, max: 400 },
        height: { ideal: 300, max: 300 }        
    },
    medium: {
        width: { ideal: 640, max: 640 },
        height: { ideal: 480, max: 480 }       
    }
}

export const SCREEN_RESOLUTION = {
    minWidth: 1280,
    maxWidth: 1280,
    minHeight: 720,
    maxHeight: 720	    
}

export const TSS = 'hsaudh^^&@*@&W*@&*&E*&@E*BENsjndh828382374&*';

export const SHOW_ADVERT_MESSENGER = true;
export const SHOW_ADVERT_VIDEO_CHAT = true;
export const SHOW_ADVERT_FULL_SCREEN = true;

export const INSTALL_EXTENSION_URL = 'https://chrome.google.com/webstore/detail/airpush-free-screen-shari/nfhkdonaoeplkgpdcehanmecmfiiionb';
