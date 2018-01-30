import axios from 'axios';
import safe from 'undefsafe';
import _ from 'lodash';
import StorageUtils from '../utils/Storage';
import TokenUtils from '../utils/TokenUtils';
TokenUtils.useToken(axios);

const API_ROOT = '/api';
import { AUTHENTICATED, MENU_OPEN, LOG_OUT
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