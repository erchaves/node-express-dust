module.exports = function (router, siteData) {

  const getPageData = function(req, res, pageName) {
    return Object.assign({}, siteData, {
      title: pageName,
      appData: {
        route: pageName,
      },
    });
  };

  /* GET home page. */
  router.get('/', function(req, res) {
    const pageData = getPageData(req, res, 'home');
    res.render('pages/home', pageData);
  });

  router.get('/about', function(req, res){
    const pageData = getPageData(req, res, 'about');
    res.render('pages/about', pageData);
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
