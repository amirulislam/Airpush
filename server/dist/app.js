/* jshint node: true */
'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _letsencrypt = require('./middleware/letsencrypt');

var _letsencrypt2 = _interopRequireDefault(_letsencrypt);

var _api = require('./routes/api');

var _api2 = _interopRequireDefault(_api);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var shouldCompress = function shouldCompress(req, res) {
	if (req.headers['x-no-compression']) {
		// don't compress responses with this request header
		return false;
	}

	// fallback to standard filter function
	return _compression2.default.filter(req, res);
};
app.use((0, _compression2.default)({ filter: shouldCompress }));

var debug = (0, _debug2.default)('airpush:app');

_mongoose2.default.connect('mongodb://localhost:27017/' + 'airpush').then(function () {
	debug('mongodb connected');
}).catch(function (err) {
	debug('Could not connect to mongo DB! - start mongo daemon');
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_express2.default.static(_path2.default.join(__dirname, 'public')));

// view engine setup
app.set('views', _path2.default.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/api', _api2.default);

app.use('/app', function (req, res, next) {
	res.render('app');
});
app.use('/install-browser', function (req, res, next) {
	res.render('install-browser');
});

app.use('/', function (req, res, next) {
	res.render('index');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.send(err);
});

var webApp = app;
if (process.env.NODE_ENV === 'production') {
	webApp = (0, _letsencrypt2.default)(app);
}
module.exports = webApp;