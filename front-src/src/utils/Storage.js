const STORAGE_KEY = 'airpush2913';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import { TSS } from '../config';

class StorageUtils {

	constructor() {}

	static isStorageSupported() {
		return typeof(Storage) !== 'undefined';
	}

	static setStorageData(dataObj) {
		if (!StorageUtils.isStorageSupported()) {
			return null;
		}		

		if (_.isString(dataObj)) {
			localStorage.setItem(STORAGE_KEY, dataObj);
			return true;
		} else if (_.isObject(dataObj)) {
			let serializiedData;
			try {
				serializiedData = JSON.stringify(dataObj);
				localStorage.setItem(STORAGE_KEY, serializiedData);
			} catch (err) { 
				console.log(err);
				return null;
			};
			return true;			
		}		
	}

	static getStorageData() {
		if (!StorageUtils.isStorageSupported()) {
			return;
		}
		let data = null;
		try {
			let serializiedData = localStorage.getItem(STORAGE_KEY);
			data = JSON.parse(serializiedData);
		} catch (err) { data = null; console.log(err); };
		return data;
	}

	static setUser(user, _x_turn_temp_auth) {
		if (!StorageUtils.isStorageSupported()) {
			return;
		}
		let allData = StorageUtils.getStorageData();
		if (_.isNil(allData)) {
			allData = {};
		}
		allData.authenticated = user;
		if (_x_turn_temp_auth) {
			allData.turn_a = _x_turn_temp_auth;
		}
		StorageUtils.setStorageData(allData);
		if (user && user.mediaSettings) {
			StorageUtils.setUserMediaSettings(user.mediaSettings);
		}
	}

	static getUser() {
		if (!StorageUtils.isStorageSupported()) {
			return false;
		}
		const allData = StorageUtils.getStorageData();
		let authenticated = false;
		if (allData) {
			authenticated = allData.authenticated;
		}
		return authenticated;
	}

	static getToken() {		
		const user = StorageUtils.getUser();
		return (user && user.token) ? user.token : null ;
	}

	static removeUser() {
		if (!StorageUtils.isStorageSupported()) {
			return;
		}		
		StorageUtils.setUser(null);
		StorageUtils.setJoinedRoom(false);
		StorageUtils.removeTurnAuth();
	}

	static setJoinedRoom(joinedRoomId) {
		if (!StorageUtils.isStorageSupported()) {
			return;
		}
		let allData = StorageUtils.getStorageData();
		if (_.isNil(allData)) {
			allData = {};
		}
		allData.joinedRoomId = joinedRoomId;
		StorageUtils.setStorageData(allData);
	}

	static getJoinedRoom() {
		if (!StorageUtils.isStorageSupported()) {
			return false;
		}
		const allData = StorageUtils.getStorageData();
		let joinedRoomId = false;
		if (allData && allData.joinedRoomId) {
			joinedRoomId = allData.joinedRoomId;
		}
		return joinedRoomId;
	}

	static removeJoinedRoom() {
		if (!StorageUtils.isStorageSupported()) {
			return;
		}		
		StorageUtils.setJoinedRoom(false);
	}
	
	static setUserMediaSettings(mediaSettings) {
		if (!StorageUtils.isStorageSupported()) {
			return;
		}
		let allData = StorageUtils.getStorageData();
		if (_.isNil(allData)) {
			allData = {};
		}
		allData.mediaSettings = mediaSettings;
		StorageUtils.setStorageData(allData);
	}

	static getUserMediaSettings() {
		if (!StorageUtils.isStorageSupported()) {
			return false;
		}
		const allData = StorageUtils.getStorageData();
		let mediaSettings = false;
		if (allData && allData.mediaSettings) {
			mediaSettings = allData.mediaSettings;
		}
		return mediaSettings;
	}
	
	static setTurnAuth(turn_a) {
		if (!StorageUtils.isStorageSupported()) {
			return;
		}
		let allData = StorageUtils.getStorageData();
		if (_.isNil(allData)) {
			allData = {};
		}
		allData.turn_a = turn_a;
		StorageUtils.setStorageData(allData);
	}

	static getTurnAuth() {
		if (!StorageUtils.isStorageSupported()) {
			return false;
		}
		const allData = StorageUtils.getStorageData();
		let turn_a = false;
		if (allData && allData.turn_a) {
			turn_a = allData.turn_a;
		}
		return turn_a;
	}	

	static getDecodedTurn() {
		let decoded = false;		
		try {
			let turnAuth = StorageUtils.getTurnAuth();
			decoded = jwt.verify(turnAuth, TSS);
		  	return [decoded.st, decoded.tu];
		} catch(err) {
			console.log(err);
		  	decoded = false;
		}		
		return decoded;		
	}

	static removeTurnAuth() {
		if (!StorageUtils.isStorageSupported()) {
			return;
		}		
		StorageUtils.setTurnAuth(null);
	}	

	static removeStorageData() {
		if (!StorageUtils.isStorageSupported()) {
			return;
		}
		try {
			localStorage.removeItem(STORAGE_KEY);
		} catch (err) { console.log(err) };		
	}	
}

export default StorageUtils;
