import axios from 'axios';
import safe from 'undefsafe';
import _ from 'lodash';
import StorageUtils from '../utils/Storage';
import SocketService from '../services/SocketService';
import TokenUtils from '../utils/TokenUtils';
TokenUtils.useToken(axios);

const API_ROOT = '/api';
import { AUTHENTICATED, MENU_OPEN, LOG_OUT, CREATE_CHAT_ROOM, 
JOINED_ROOM, LEAVED_ROOM, OPEN_NOTIFICATION } from './Types';

import { store } from '../index';


if (StorageUtils.getUser()) {
	SocketService.getInstance().connect();
} else {
	SocketService.getInstance().disconnect();
}


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

export const roomJoined = roomId => {
	console.log('Dispatch room 1')
	store.dispatch({
		type: JOINED_ROOM,
		payload: roomId	
	});
	store.dispatch({
		type: OPEN_NOTIFICATION,
		payload: {
			message: 'Room joined!'
		}
	});	
}

export const roomLeaved = roomId => {
	return (dispatch, getState) => {
		dispatch({
			type: LEAVED_ROOM,
			payload: false
		})
		// SocketService.getInstance().createRoom();
	}
}


// create chat room
// export const createChatRoom = (onSuccess, onError) => {
// 	return (dispatch, getState) => {
// 		const { authenticated } = getState();
// 		if (!_.isNil(safe(authenticated, '_id'))) {
// 			axios.post(`${API_ROOT}/chat-room`, { userId: authenticated._id })
// 			.then(({ data }) => {
// 				console.log('CREATE RESULT', data)
// 				if (onSuccess) {
// 					onSuccess();
// 				}
// 				dispatch({
// 					type: CREATE_CHAT_ROOM,
// 					payload: data.data	
// 				})
// 			})
// 			.catch(err => {
// 				console.log('errrrr', err.message);
// 				if (safe(err, 'err.message') && _.isFunction(onError)) {
// 					onError(err.message);
// 				}
// 			});
// 		}
// 	}
// }