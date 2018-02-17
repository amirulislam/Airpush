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