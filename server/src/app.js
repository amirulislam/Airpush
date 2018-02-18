/* jshint node: true */
'use strict';

import express from 'express';
import path from 'path';
import logger from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import compression from 'compression';

import Https from './middleware/letsencrypt';

import apiV1 from './routes/api';

const app = express();
const shouldCompress = (req, res) => {
	if (req.headers['x-no-compression']) {
		// don't compress responses with this request header
		return false
	}

  	// fallback to standard filter function
	return compression.filter(req, res);
}
app.use(compression({filter: shouldCompress}))

import debugPck from 'debug';
const debug = debugPck('airpush:app');

mongoose.connect('mongodb://localhost:27017/' + 'airpush').then(() => {
	debug('mongodb connected');
}).catch(err => {
	debug('Could not connect to mongo DB! - start mongo daemon');
});


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/api', apiV1);

app.use('/app', (req, res, next) => {
	res.render('app');
});
app.use('/install-browser', (req, res, next) => {
	res.render('install-browser');
});

app.use('/', (req, res, next) => {
	res.render('index');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.send(err);
});

let webApp = app;
if (process.env.NODE_ENV === 'production') {
	webApp = Https(app);
}
module.exports = webApp;
