exports.get404 = (req, res, next) => {
   res.status(404).render('404', 
   {  pageTitle: 'Page Not Found',
      path: '/404',
      isLoggedIn: req.session.user 
    });
};

exports.get500 = (req, res, next) => {
   if(req.url == "/500"){
      return res.status(500).render('500', 
      {  pageTitle: 'Error',
         path: '/500',
         isLoggedIn: req.session.user 
      });
   }
      next();
};

