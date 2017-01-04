var express = require('express');
var siteData = require('../bin/constants');
var siteDefaults = require('../bin/defaults');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var data = Object.assign({}, siteDefaults, siteData, {
    injectData: {
      route: 'home',
    },
  });

  res.render('pages/home', data);
});

router.get('/about', function(req, res){
  var data = Object.assign({}, siteDefaults, siteData, {
    title: 'about',
    injectData: {
      route: 'about',
    },
  });

  res.render('pages/about', data);
});

module.exports = router;
