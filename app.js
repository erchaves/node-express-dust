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
var session = require('express-session');
var passport = require('passport');
var Auth0Strategy = require('passport-auth0');
var app = express();
var isDev = app.get('env') === 'development';
var strategy;
var routes;
var user;

var forceSsl = function (req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }

  return next();
};

if (isDev){
  // load the process.env vars from the /.env file
  // production should set these values differently
  require('dotenv').config();
} else {
  // force https in production
  app.use(forceSsl);
}

// these might depend on the dotenv config above.
// Todo: that kind of sucks, consider making that dependency more clear.
routes = require('./routes/index');
user = require('./routes/user');

// This will configure Passport to use Auth0
strategy = new Auth0Strategy({
  domain:       process.env.AUTH0_DOMAIN,
  clientID:     process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  callbackURL:  process.env.AUTH0_CALLBACK_URL,
}, function(accessToken, refreshToken, extraParams, profile, done) {
  // accessToken is the token to call Auth0 API (not needed in the most cases)
  // extraParams.id_token has the JSON Web Token
  // profile has all the information from the user
  return done(null, profile);
});

passport.use(strategy);

// you can use this section to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// use alternative delimiter for ejs
ejs.delimiter = '?';

// Using the .html extension instead of
// having to name the views as *.ejs
app.engine('html', ejs.__express);
// Set the folder where the pages are kept
app.set('views', __dirname + '/views');

// This avoids having to provide the
// extension to res.render()
app.set('view engine', 'html');

app.get('/about', function(req, res){
  var data = Object.assign({}, siteDefaults, siteData, {
    title: 'about',
    page: 'pages/about.html',
    injectData: {
      route: 'about',
    },
  });

  res.render('index', data);
});

app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: 'shhhhhhhhh',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', routes);
app.use('/user', user);

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
