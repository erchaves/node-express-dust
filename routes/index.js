var express = require('express');
var passport = require('passport');
var siteData = require('../bin/constants');
var siteDefaults = require('../bin/defaults');
var router = express.Router();

var env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL,
};

/* GET home page. */
router.get('/', function(req, res) {
  console.log(req.user);

  var data = Object.assign({}, siteDefaults, siteData, {
    env: env,
    page: 'pages/home.html',
    user: req.user,
    injectData: {
      route: 'home',
    },
  });

  res.render('index', data);
});

router.get('/login', function(req, res) {
  var data = Object.assign({}, siteDefaults, siteData, {
    env: env,
    page: 'pages/login.html',
    injectData: {},
  });

  res.render('index', data);
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/url-if-something-fails' }),
  function(req, res) {
    res.redirect(req.session.returnTo || '/user');
  });


module.exports = router;
