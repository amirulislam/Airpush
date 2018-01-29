import axios from 'axios';
import safe from 'undefsafe';
import _ from 'lodash';
import StorageUtils from '../utils/Storage';
import TokenUtils from '../utils/TokenUtils';
TokenUtils.useToken(axios);

const API_ROOT = '/api';
import { AUTHENTICATED } from './Types';

// retrive apps data
export const signIn = (email, strategy, accessToken, onSuccess, onError) => {
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
			if (safe(err, 'response.data.message') && _.isFunction(onError)) {
				onError(err.response.data);
			}
		});
	}
}