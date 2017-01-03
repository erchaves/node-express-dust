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
var adaro = require('adaro');
var app = express();
var isDev = app.get('env') === 'development';
var routes = require('./routes/index');
var dustOptions = {
  helpers: [],
  // don't cache on dev so we can see changes
  cache: !isDev,
};

if (isDev) {
  app.set('views', './src/views');
  app.engine('html', adaro.dust(dustOptions));
  app.set('view engine', 'html');
} else {
  // For rendering precompiled templates:
  app.set('views', './dist/views');
  // todo: confirm that this adaro.js method takes the same dustOptions
  app.engine('js', adaro.js(dustOptions));
  app.set('view engine', 'js');
}

app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static('./dist'));

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
// app.use(favicon('./src/images/favicon.ico'));

module.exports = app;
