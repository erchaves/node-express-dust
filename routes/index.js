module.exports = function (router, siteData) {

  /* GET home page. */
  router.get('/', function(req, res) {
    var renderData = Object.assign({}, siteData, {
      title: 'home',
      appData: {
        route: 'home',
      },
      isDev: siteData.isDev,
    });

    res.render('pages/home', renderData);
  });

  router.get('/about', function(req, res){
    var renderData = Object.assign({}, siteData, {
      title: 'about',
      appData: {
        route: 'about',
      },
      isDev: siteData.isDev,
    });

    res.render('pages/about', renderData);
  });

  router.get('/demo-preact', function(req, res){
    var renderData = Object.assign({}, siteData, {
      title: 'Demo Preact',
      appData: {
        route: 'demo-preact',
      },
      isDev: siteData.isDev,
    });

    res.render('pages/demo-preact', renderData);
  });

  return router;
};
