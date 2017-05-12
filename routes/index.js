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

  return router;
};
