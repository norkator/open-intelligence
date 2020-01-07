function Site(router, sequelizeObjects) {

  router.post('/base/route', function (req, res) {
    res.status(200);
    res.send('Hello world');
  });


}

exports.Site = Site;
