var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var siteData = require('./bin/constants');
var siteDefaults = require('./bin/defaults');
var ejs = require('ejs');
var helmet = require('helmet');
var app = express();
var isDev = app.get('env') === 'development';
var routes;

// these might depend on the dotenv config above.
// Todo: that kind of sucks, consider making that dependency more clear.
routes = require('./routes/index');

// use alternative delimiter for ejs
ejs.delimiter = '?';

// Set the folder where the pages are kept
app.set('views', __dirname + '/views');

// Using the .html extension instead of
// having to name the views as *.ejs
app.engine('html', ejs.__express);

// This avoids having to provide the
// extension to res.render()
app.set('view engine', 'html');

app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  var errorData = isDev ? err : {};
  var data = Object.assign({}, siteDefaults, siteData, {
    title: 'Error',
    page: 'pages/error.html',
    message: err.message,
    error: errorData,
    injectData: {},
  });

  res.status(err.status || 500);
  res.render('index', data);
});

// uncomment this after adding a favicon
// app.use(favicon(__dirname + '/src/images/favicon.ico'));

module.exports = app;
