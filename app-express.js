const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const logger = require('morgan');
const path = require('path');
const siteDefaults = require('./src/scripts/defaults');
const sugarcone = require('@erchaves/sugarcone');
const sugarconeConfig = require('./sugarcone-config');
const sugarconeExpress = sugarcone.getExpressBuild(sugarconeConfig.pathDist);

var app = express();
var env = process.env.NODE_ENV || 'development';
var isDev = env !== 'production';

var routesIndex;
var siteData;
var user;

if (fs.existsSync('./.env')) {
  // this sets node configs from .env into the environment
  require('dotenv').config();
}

// extend site defaults
siteData = Object.assign({}, siteDefaults, {
  isDev: isDev,
});

routesIndex = require('./routes/index')(express.Router(), siteData);

if (isDev) {
  app.set('views', './src/views');
  app.engine('html', sugarconeExpress.dust);
  app.set('view engine', 'html');

  // use livereload
  app.use(require('connect-livereload')({
    port: 35729
  }));
} else {
  // For rendering precompiled templates:
  // todo: make this explicit #dustDistViews
  app.set('views', './dist/views');
  app.engine('js', sugarconeExpress.dustPrecompiled);
  app.set('view engine', 'js');
}


app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'dist')));

// todo: remove
// app.use(require('prerender-node').set('prerenderServiceUrl', 'http://localhost:3000').set('protocol', 'https'));

// this shouldn't be needed, but for some reason this url is not rendering a 510 error on prod.
// handle this SEO request to make sure it returns a better error. Using a 410.
app.get('/civic.htm', function(req, res) {
  res.status(410).send('Error 410: Sorry, this is a dead url.');
});

// app.get('*', function(req, res) {
//   res.render('index');
// });

app.use('/', routesIndex);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// // error handler
app.use(function(err, req, res, next) {
  var errorData = isDev ? err : {};
  var data = Object.assign({}, siteData, {
    title: 'Error',
    page: 'pages/error.html',
    message: err.message,
    error: errorData,
    appData: {},
    isDev: isDev,
  });

  res.status(err.status || 500);
  res.render('pages/error', data);
});

module.exports = app;
