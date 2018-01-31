import axios from 'axios';
import safe from 'undefsafe';
import _ from 'lodash';
import StorageUtils from '../utils/Storage';
import TokenUtils from '../utils/TokenUtils';
TokenUtils.useToken(axios);

const API_ROOT = '/api';
import { AUTHENTICATED, MENU_OPEN, LOG_OUT, CREATE_CHAT_ROOM
 } from './Types';

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
		dispatch({
			type: LOG_OUT,
			payload: open
		})
		location.reload();	
	};	
}

// create chat room
export const createChatRoom = (onSuccess, onError) => {
	return (dispatch, getState) => {
		const { authenticated } = getState();
		if (!_.isNil(safe(authenticated, '_id'))) {
			axios.post(`${API_ROOT}/chat-room`, { userId: authenticated._id })
			.then(({ data }) => {
				console.log('CREATE RESULT', data)
				if (onSuccess) {
					onSuccess();
				}
				dispatch({
					type: CREATE_CHAT_ROOM,
					payload: data.data	
				})
			})
			.catch(err => {
				console.log('errrrr', err.message);
				if (safe(err, 'err.message') && _.isFunction(onError)) {
					onError(err.message);
				}
			});
		}
	}
}