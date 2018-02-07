const STORAGE_KEY = 'airpush2913';
import _ from 'lodash';

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

	static setUser(user) {
		if (!StorageUtils.isStorageSupported()) {
			return;
		}
		let allData = StorageUtils.getStorageData();
		if (_.isNil(allData)) {
			allData = {};
		}
		allData.authenticated = user;
		StorageUtils.setStorageData(allData);
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
