var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var siteDefaults = require('./src/scripts/defaults');
var helmet = require('helmet');
// adaro is the dust wrapper that works well with express
var adaroDust = require('adaro');
var dustSetup = require('./src/scripts/dust-setup');
var fs = require('fs');
var app = express();
var env = process.env.NODE_ENV || 'development';
var isDev = env !== 'production';

var routesIndex;
var dustOptions;
var dustHtml;
var dustJs;
var siteData;

if (fs.existsSync('./.env')) {
  // this sets node configs from .env into the environment
  require('dotenv').config();
}

dustOptions = {
  helpers: [
    function (dust) {
      dustSetup.setup(dust, isDev);
    },
  ],
  // todo: not sure if this setting is actually getting passed through...
  whitespace: true,
  // don't cache on dev so we can see changes
  cache: !isDev,
};

// extend site defaults
siteData = Object.assign({}, siteDefaults, {
  isDev: isDev,
});

routesIndex = require('./routes/index')(express.Router(), siteData);

dustHtml = adaroDust.dust(dustOptions);
dustJs = adaroDust.js(dustOptions);

if (isDev) {
  app.set('views', './src/views');
  app.engine('html', dustHtml);
  app.set('view engine', 'html');
} else {
  // For rendering precompiled templates:
  app.set('views', './dist/views');
  app.engine('js', dustJs);
  app.set('view engine', 'js');
}

app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static('./dist'));

app.use('/', routesIndex);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
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
