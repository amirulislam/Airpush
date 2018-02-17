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
MESSAGE_DOWNLOAD_PROGRESS, ALTER_MESSAGE_PAYLOAD, ACCOUNT_REMOVED, MEDIA_SOURCE_ADDED, 
REMOVE_SINGLE_MEDIA_SOURCE, REMOVE_MEDIA_SOURCES, MAXIMIZE_MEDIA_SOURCE, MESSENGER_RIGHT_CHANGE_STATE,
OPEN_CLOSE_FULL_SCREEN, OPEN_INFO_ALERT, ALERT_MESSAGE, USER_MEDIA_SETTINGS } from './Types';

import { SOCKET_EVENTS } from '../config';
import { store } from '../index';

import PeerService from '../services/peer-advanced/PeerService';


// retrive apps data
export const signIn = (email, strategy, accessToken, onSuccess, onError) => {
	console.log('sign in');
	let postData = { email, strategy, accessToken };
	if (strategy === 'FACEBOOK') {
		postData.userID = email;
	}
	return (dispatch, getState) => {   
		axios.post(`${API_ROOT}/signin`, postData)
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
		removeAllMediaSources();		
		PeerService.getInstance().disconnectAndRemoveAllPeers();
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

// open alert info / across app
export const openInfoAlert = (data, alertType) => {
	store.dispatch({
		type: OPEN_INFO_ALERT,
		payload: { data, alertType }
	});	
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

// remove account
export const removeAccount = () => {
	return (dispatch, getState) => {
		axios.delete(`${API_ROOT}/account`)
		.then(({ data }) => {
			// dispatch({
			// 	type: ACCOUNT_REMOVED,
			// 	payload: false	
			// })
			StorageUtils.removeUser();
			SocketService.getInstance().disconnect();
			dispatch({
				type: LOG_OUT,
				payload: open
			})
			location.reload();
		})
		.catch(err => {
			console.log(err);
			if (safe(err, 'response.data.message') && _.isFunction(onError)) {
				onError(err.response.data);
			}
		});
	}
}

export const addMediaSource = payload => {
	store.dispatch({
		type: MEDIA_SOURCE_ADDED,
		payload
	});
}

export const removeAllMediaSources = payload => {
	store.dispatch({
		type: REMOVE_MEDIA_SOURCES,
		payload
	});
}

export const removeSingleMediaSource = peerId => {
	store.dispatch({
		type: REMOVE_SINGLE_MEDIA_SOURCE,
		payload: peerId
	});	
}

export const maximizeMediaSource = peerId => {
	return (dispatch, getState) => {
		dispatch({
			type: MAXIMIZE_MEDIA_SOURCE,
			payload: peerId
		});	
	}
}

export const changeOpenChatState = () => {
	return (dispatch, getState) => {
		dispatch({
			type: MESSENGER_RIGHT_CHANGE_STATE,
			payload: null
		});	
	}
}

export const openFullScreen = val => {
	return (dispatch, getState) => {
		dispatch({
			type: OPEN_CLOSE_FULL_SCREEN,
			payload: val
		});	
	}
}

// open popup alert / across app
export const openPopupAlert = (data, alertType) => {
	return {
		type: ALERT_MESSAGE,
		payload: { data, alertType }		
	}	
}

// open popup alert / across app
export const openPopupAlertFromClass = (data, alertType) => {
	store.dispatch({
		type: ALERT_MESSAGE,
		payload: { data, alertType }	
	});	
}

// retrive media settings
export const getUserMediaSettings = (onSuccess) => {
	return (dispatch, getState) => {   
		axios.get(`${API_ROOT}/account/media-settings`)
		.then(({ data }) => {
            if (onSuccess) {
                onSuccess();
			}
			dispatch({
				type: USER_MEDIA_SETTINGS,
				payload: data.data.mediaSettings
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


// update media settings
export const updateUserMediaSettings = (mediaSettings, onSuccess) => {
	return (dispatch, getState) => {   
		axios.put(`${API_ROOT}/account/media-settings`, {
			camState: mediaSettings.camState,
			micState: mediaSettings.micState
		})
		.then(({ data }) => {
            if (onSuccess) {
                onSuccess();
			}
			dispatch({
				type: 'nothing',
				payload: null
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