const crypto = require('crypto');
const express = require('express');
const router = express.Router();

const bcrypt = require("bcryptjs");
const User = require('../models/user');
const isAuth = require('../middleware/is-auth');

const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: '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'
    }
}));

router.get('/signup', (req, res, next) => {

    res.render('signup', {
        pageTitle: 'Signup Page',
        path:'/signup',
    });
});

router.post('/signup', (req, res) => {

    const userName = req.body.name;
    const userEmail = req.body.email;
    const userPass = req.body.password;
    const passConfirmation = req.body.passconfirmation;

    if(userPass === passConfirmation){

        User.findUserByEmail(userEmail)
        .then(existingUser => {
            // if(existingUser){
            //     console.log("User already exist!")
            //     res.redirect('/signup');
            // }else{
                return bcrypt.hash(userPass, 12)
                .then(encryptedPass => {
                    const user = new User(userName, userEmail, encryptedPass);

                    return user.save()
                        .then(result => {
                            
                            res.redirect('/login');
                            
                            transporter.sendMail({
                                to: user.email,
                                from: 'shop@guerlak.com',
                                subject: 'Signup succeed',
                                html: '<h2>Hello, ' + userName + ' your registration was done...</h2>'
                                });
                            })                        
                        })
                        .catch(err => {
                            throw err;
                        })
                })
            // }
        .catch(err => {
            console.log(err);
        })

    }else{
        console.log("Error comparing passwords...")
        res.redirect('/signup');
    }    
});

router.get('/login',(req, res, next) => {

    let msg = req.flash('error');

    if( msg.length > 0){
        msg = msg[0];
        console.log(msg)
        console.log("goooo")
    }else{
        msg = null;
    }

    res.render('login', {
        pageTitle: 'Login Page',
        path:'/login',
        errorMsg: msg
    });
});

router.post('/login', (req, res, next) => {

    const userEmail = req.body.email;
    const userPass = req.body.password;

    User.findUserByEmail(userEmail)
    .then(user => {
        if(!user){
            req.flash('error', 'invalid email or passord');
            res.redirect('/login');
        }else{
            bcrypt.compare(userPass, user.password)
            .then(passOk => {
                if(passOk){
                    req.session.isLoggedin = true;
                    req.session.user = user;
                    console.log("passando sessao ")
                    return req.session.save(err =>{
                            console.log(err);
                    })
                }
            }).then(result =>{
                res.redirect('/')
            })
            .catch(err=> {
                console.log(err)
                res.redirect('/login')
            })
        }
    }).catch(err =>  {
        console.log(err);
    });
});

router.post('/logout', isAuth, (req, res, next) => {

    //session will be deleted on DB, the session cookie persist until the browser close.
    req.session.destroy(err => {
        console.log(err);

        res.redirect('/login')
    })
});

router.get('/reset-pass', (req, res, next) => {

    let msg = req.flash('error');

    if( msg.length > 0){
        msg = msg[0];
    }else{
        msg = null;
    }


    res.render('reset-pass', {
        pageTitle: 'Reset Password',
        path:'/reset-pass',
        errorMsg: msg
        
    });

})

router.post('/reset-pass', (req, res, next) => {

    //cerate token to send by email and after get by params (crypto NodeJS func)
    crypto.randomBytes(32, (err, buffer ) =>{
        if(err){
           return res.redirect('reset-pass')
        }
        const token = buffer.toString('hex');
        const userEmail = req.body.email;

        User.findUserByEmail(userEmail)
        .then(user => {
            if(!user){
                req.flash('error', 'this email isnt exist...');
                return res.redirect('/reset-pass');
            }

            const userNew = new User(user.name, user.email, user.password);

            userNew.resetToken = token;
            userNew.resetTokenExpiration = Date.now() + 3600000;
            
            return userNew.update(userEmail, token)
    
                .then(result => {
                    console.log(result);
                    console.log("Reseting password");

                    transporter.sendMail({
                        to: userEmail,
                        from: 'admin@guerlak.com',
                        subject: 'Reset Password',
                        html: '<h2>Hello, click <a href="http://localhost:3000/new-password/?token='+token+'">here</a> to reset your password.</h2>'
                    });

                    res.redirect('/login');
                })
                .catch(err =>  {
                    console.log(err);                        
                })
        })
        .catch(err=> {
            console.log(err);
        })
    })
})     

router.get('/new-password', (req, res, next) => {

    const token = req.params.token;

    res.render('new-password', {
        pageTitle: 'New Password',
        path:'/new-password',
        errorMsg: null
        
    });
})

router.post('/new-password', (req, res, next) => {

  
})

module.exports = router;