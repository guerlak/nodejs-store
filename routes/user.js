const express = require('express');
const router = express.Router();

exports.getUser = router.get('/user-profile', (req, res)=> {
    res.render('user-profile', {
        pageTitle: 'My Profile',
        path: '/admin/add-product',
        user: req.user,
        isLoggedIn: req.session.isLoggedin
    });
});

