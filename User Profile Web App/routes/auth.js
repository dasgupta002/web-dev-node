var express = require('express');
var router = express.Router();
var passport = require('passport');
var hashutils = require('../utils/encrypt');

router.get('/login', (req, res, next) => {
    var messages = req.flash();
    res.render('login', { messages });
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/auth/login', failureFlash: 'Error! Check your username as well the password.' }), (req, res, next) => {
    res.redirect('/users'); 
});

router.get('/register', (req, res, next) => {
    var messages = req.flash();
    res.render('register', { messages });
});

router.post('/register', (req, res, next) => {
    var registerParams = req.body;
    var users = req.app.locals.users;

    var payload = {
        username: registerParams.username,
        password: hashutils.hashing(registerParams.password)
    };
    users.insertOne(payload, (error) => {
        if(error) req.flash('error', 'Error! User already exists.');
        req.flash('success', 'Hurray! User is onboard.');
        
        res.redirect('/auth/register');
    });
});

router.get('/logout', (req, res, next) => {
    req.session.destroy();

    res.redirect('/');
});

module.exports = router;