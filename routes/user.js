var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var siteData = require('../bin/constants');
var siteDefaults = require('../bin/defaults');
var router = express.Router();

/* GET user profile. */
router.get('/', ensureLoggedIn, function(req, res, next) {
  var data = Object.assign({}, siteDefaults, siteData, {
    page: 'pages/user.html',
    user: req.user,
    injectData: {},
  });

  res.render('index', data);
});

module.exports = router;
