import React from 'react';
import ReactDom from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { BrowserRouter, Route, browserHistory } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { blueA200 } from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: blueA200
  },
  appBar: {
    height: 50,
  },
});

import rootReducer from './reducers';

export const store = createStore(rootReducer, {}, compose(
	applyMiddleware(ReduxThunk)
));

import RequireAuth from './components/auth/RequireAuth';
import Main from './components/Main';


ReactDom.render(
	<MuiThemeProvider>
		<Provider store={store}>
			<BrowserRouter history={ browserHistory }>
				<Route path="/app" component={ RequireAuth(Main) } />
			</BrowserRouter>
		</Provider>
	</MuiThemeProvider>
, document.getElementById('airpush-ui'));