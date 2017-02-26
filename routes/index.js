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

  return router;
};
