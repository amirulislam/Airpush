import StorageUtils from './Storage';

class TokenUtils {

	static useToken(axios) {
		// Add a request interceptor
		axios.interceptors.request.use((config) => {
		    config.headers.x__authorization = StorageUtils.getToken(); 
		    return config;
		  }, (error) => {
		    return Promise.reject(error);
		});


	}
}
export default TokenUtils;
