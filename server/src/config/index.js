export const USER_ROLES = {
    PLATFORM_USER: 'PLATFORM_USER',
    DEV_OPS: 'DEV_OPS',
    ADMIN: 'ADMIN'
}

export const USER_TOKEN_SECRET = '123749823%@$#7234VBJSQKJSQJHJHSJS&^%^***ewhrh';

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
    PEER_SIGNAL: 'PEER_SIGNAL',
    PEER_SIGNAL_ANSWER: 'PEER_SIGNAL_ANSWER',
    PEER_SIGNAL_ICE: 'PEER_SIGNAL_ICE',
    PEER_SIGNAL_IM_READY: 'PEER_SIGNAL_IM_READY'
}

export const IS_PRODUCTION = process.env.NODE_ENV === 'production' ? true : false;

// letsencrypt config
const getLetsEncryptConfig = () => {
    return IS_PRODUCTION ? {
        email: 'crisu.ionel@gmail.com',
        approvedDomains: ['airpush.io']
    } : {
        email: 'crisu.ionel@gmail.com',
        approvedDomains: ['127.0.0.1']
    };
};
export const LETS_ENCRYPT_CONFIG = getLetsEncryptConfig();

export const GOOGLE_CLIENT_ID = '540129414870-dm5d15e5768bl039hbmu4gabfer70ciq.apps.googleusercontent.com';

export const SLACK_NOTIFY = {
    webhook: 'https://hooks.slack.com/services/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',
    chanel: '#airpush'
}

const OPPS_USERS = ['crisu.ionel@gmail.com'];

export const getUserRole = email => {
    if (!email) {
        return USER_ROLES.PLATFORM_USER;
    }
    let role = USER_ROLES.PLATFORM_USER;
    for (let i = 0; i < OPPS_USERS.length; i++) {
        if (OPPS_USERS[i] === email) {
            role = USER_ROLES.DEV_OPS;
            break;
        }
    }
    return role;
}


