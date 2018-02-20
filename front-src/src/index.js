import React from 'react';
import ReactDom from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { withRouter } from 'react-router';
import ReduxThunk from 'redux-thunk';
import { BrowserRouter, Route, browserHistory } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { deepPurple900 } from 'material-ui/styles/colors';

import BrowserService from './services/browser/BrowserService';
BrowserService.checkSupported();

import { EVENTS_EXT } from './services/screen-sharing/ScreenSharingService';
import ScreenSharingService from './services/screen-sharing/ScreenSharingService';
let inst = ScreenSharingService.getInstance();

let callback = (event) => {
	inst.removeEvent(EVENTS_EXT.SIGNAL_PRESENCE, callback);
	inst.addListener(EVENTS_EXT.SOURCE_AQUIRED, (data) => {
		console.log('SOURCE AQUIRED', data.sourceId);

		navigator.mediaDevices.getUserMedia({
			audio: false,
			video: {
				mandatory: {
					chromeMediaSource: 'desktop',
					chromeMediaSourceId: data.sourceId,
					minWidth: 1280,
					maxWidth: 1280,
					minHeight: 720,
					maxHeight: 720					
				}
			}
		})
		.then(stream => {
			console.log('GOT STREAM');
			stream.getTracks().forEach(track => {
				console.log('TRACK', track);
				track.onended = () => { console.log('ON TRACK ENDED') }
			})
		})
		.catch(err => {
			console.log('ERROR', err);
		}) 		


	})
	inst.addListener(EVENTS_EXT.ACCESS_DENIED, () => {
		console.log('SOURCE ACCESS_DENIED');
	})	
	inst.requestSourceId();
}

inst.addListener(EVENTS_EXT.SIGNAL_PRESENCE, callback)
inst.test();

export const muiTheme = getMuiTheme({
  palette: {
    primary1Color: deepPurple900
  },
  appBar: {
    height: 50,
  },
});

import rootReducer from './reducers';
import StorageUtils from '../src/utils/Storage';
import queryString from 'query-string';

const parsed = queryString.parse(window.location.search);
if (parsed.r && (window.location.pathname === '/app' || window.location.pathname === '/app/')) {
	StorageUtils.setJoinedRoom(parsed.r);
}

export const store = createStore(rootReducer, StorageUtils.getStorageData() || {}, compose(
	applyMiddleware(ReduxThunk)
));

import RequireAuth from './components/auth/RequireAuth';
import Main from './components/Main';


ReactDom.render(
	<MuiThemeProvider muiTheme={muiTheme}>
		<Provider store={store}>
			<BrowserRouter history={ browserHistory }>
				<Route path="/app" component={ RequireAuth(withRouter(Main)) } />
			</BrowserRouter>
		</Provider>
	</MuiThemeProvider>
, document.getElementById('airpush-ui'));