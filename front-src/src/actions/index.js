import axios from 'axios';
import safe from 'undefsafe';
import _ from 'lodash';
import StorageUtils from '../utils/Storage';
import SocketService from '../services/SocketService';
import TokenUtils from '../utils/TokenUtils';
TokenUtils.useToken(axios);

const API_ROOT = '/api';
import { AUTHENTICATED, MENU_OPEN, LOG_OUT, CREATE_CHAT_ROOM, 
JOINED_ROOM, LEAVED_ROOM, OPEN_NOTIFICATION, ROOM_CREATED_NOW, NEW_USER_JOIN, 
USER_LEFT, MESSAGE, JOINED_ROOM_ID, REMOVE_GROUP_MESSAGES, REMOVE_INTERNAL_MESSAGE, 
MESSAGE_DOWNLOAD_PROGRESS, ALTER_MESSAGE_PAYLOAD } from './Types';

import { SOCKET_EVENTS } from '../config';

import { store } from '../index';


// retrive apps data
export const signIn = (email, strategy, accessToken, onSuccess, onError) => {
	console.log('sign in');
	return (dispatch, getState) => {   
		axios.post(`${API_ROOT}/signin`, {
			email: email,
            strategy: strategy,
            accessToken: accessToken
		})
		.then(({ data }) => {
			StorageUtils.setUser(Object.assign({
                token: data.data.token
			}, data.data.user));
			SocketService.getInstance().connect();
            if (onSuccess) {
                onSuccess();
            }
			dispatch({
				type: AUTHENTICATED,
				payload: data.data.user	
			})
		})
		.catch(err => {
			console.log(err);
			if (safe(err, 'response.data.message') && _.isFunction(onError)) {
				onError(err.response.data);
			}
		});
	}
}
// toggle menu
export const toggleMenu = (open = true) => {
	return (dispatch, getState) => {
		dispatch({
			type: MENU_OPEN,
			payload: open
		})	
	};
}

// log out
export const logOut = () => {
	return (dispatch, getState) => {
		StorageUtils.removeUser();
		SocketService.getInstance().disconnect();
		dispatch({
			type: LOG_OUT,
			payload: open
		})
		location.reload();	
	};	
}

// create chat group
export const createChatGroup = () => {
	return (dispatch, getState) => {
		SocketService.getInstance().createRoom();
	}
}

// room joined event
export const roomJoined = roomId => {
	console.log('Dispatch room 1')
	store.dispatch({
		type: JOINED_ROOM,
		payload: roomId	
	});
	sendNotification('Successfully joined the group');
}

// join room
export const joinRoomNow = (roomToJoin) => {
	return (dispatch, getState) => {
		const { roomId } = getState();
		if (roomId) {
			// disconnect from room 
			roomLeaved();
		}
		console.log('JOIN ROOM NOW', roomToJoin, getState());
		SocketService.getInstance().joinRoom(roomToJoin);
		dispatch({
			type: 'AAAA',
			payload: { message: 'bbbb' }
		});		
	}	
}

export const roomCreated = roomId => {
	store.dispatch({
		type: JOINED_ROOM,
		payload: roomId	
	});
	roomCreatedFirstTime(true);
	joinedRoomId(roomId);
	sendNotification('Successfully joined the group');
}

export const roomCreatedFirstTime = (val = true) => {
	store.dispatch({
		type: ROOM_CREATED_NOW,
		payload: true	
	});	
}

// self joined room
export const roomJoinedBySelf = roomId => {
	store.dispatch({
		type: JOINED_ROOM,
		payload: roomId	
	});
	joinedRoomId(roomId);
	sendNotification('Successfully joined the group!');
}


// room leaved event (current user)
export const roomLeaved = roomId => {
	return (dispatch, getState) => {
		sendNotification('You have left the group!');
		joinedRoomId(false);
		dispatch({
			type: LEAVED_ROOM,
			payload: false
		});
		dispatch({
			type: REMOVE_GROUP_MESSAGES,
			payload: false
		});
	}
}

// leave room now
export const leaveRoom = () => {
	console.log('Leave room');
	SocketService.getInstance().send({}, SOCKET_EVENTS.LEAVE_ROOM);
	return roomLeaved();
}

export const sendNotification = (message, timeout) => {
	store.dispatch({
		type: OPEN_NOTIFICATION,
		payload: { message, timeout }
	});	
}

export const sendNotificationFromComponent = (message, timeout) => {
	return (dispatch, getState) => {
		dispatch({
			type: OPEN_NOTIFICATION,
			payload: { message, timeout }
		});		
	}
}

// add new user
export const addUser = (user) => {
	if (user) {
		dispatchInternalMessage(user);
		store.dispatch({
			type: NEW_USER_JOIN,
			payload: user	
		});
	}
}

// remove user
export const removeUser = (user) => {
	if (user) {
		dispatchInternalMessage(user);
		store.dispatch({
			type: USER_LEFT,
			payload: user
		});
	}
}

// dispatch internal message
export const dispatchInternalMessage = (message) => {
	store.dispatch({
		type: MESSAGE,
		payload: message	
	});
}

// dispatch internal message from within component
export const dispatchInternalMessageFromComponent = (message) => {
	return {
		type: MESSAGE,
		payload: message		
	}
}

// remove internal message
export const removeInternalMessage = messageId => {
	return {
		type: REMOVE_INTERNAL_MESSAGE,
		payload: messageId		
	}
}

export const joinedRoomId = (joinedRoomId) => {
	StorageUtils.setJoinedRoom(joinedRoomId);
	store.dispatch({
		type: JOINED_ROOM_ID,
		payload: joinedRoomId	
	});	
}

// retrive all other users
export const getOthers = () => {
	if (store) {
		const { users } = store.getState();
		return users || [];
	} else {
		return [];
	}
}

// alter message payload
export const alterMessage = (messageId, data) => {
	return {
		type: ALTER_MESSAGE_PAYLOAD,
		payload: { messageId, data }			
	}
}

export const alterMessageDispatch = (messageId, data) => {
	store.dispatch({
		type: ALTER_MESSAGE_PAYLOAD,
		payload: { messageId, data }
	});
}

// inform ui message about download progress
export const downloadMessageInformProgress = (messageId, progress) => {
	store.dispatch({
		type: MESSAGE_DOWNLOAD_PROGRESS,
		payload: { progress, messageId }	
	});
}


export const test = () => {
	const user = {
		email: "eblocksapps@gmail.com",
		iat: 1517557279,
		name: "Eblocks Shopify Apps",
		photo: "https://lh3.googleusercontent.com/-8MSgQc63eVM/AAAAAAAAAAI/AAAAAAAAAAA/ACSILjXvFAN17fKuukGjHsKuZ81RHP2TRw/s96-c/photo.jpg",
		_id: "5a74161feddff24834fbaf88",
		msgType: "NEW_USER_JOINED"
	}
	store.dispatch({
		type: NEW_USER_JOIN,
		payload: user	
	});
	dispatchInternalMessage(user);	
}
setTimeout(() => {
	for (let index = 0; index < 10; index++) {
		//test();
	}	
}, 2000);
