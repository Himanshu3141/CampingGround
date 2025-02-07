const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utilities/catchAsync');
const users = require('../controllers/users');


router.route('/register')
    .get(users.renderregister) 
    .post(catchAsync(users.register));  


router.route('/login')
    .get(users.renderlogin)  
    .post(
        passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
        users.login  
    );


router.get('/logout', users.logout);  

module.exports = router;
