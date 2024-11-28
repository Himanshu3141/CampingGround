const User=require('../models/user');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const flash = require('connect-flash');

module.exports.renderregister=(req,res)=>{
    res.render('users/register');
};

module.exports.register=async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Yelp Camp!');
            return res.redirect('/campgrounds');
        });
    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('/register');
    }
};

module.exports.renderlogin=async(req,res)=>{
    res.render('users/login');
};

module.exports.login=(req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect('/campgrounds');
};

module.exports.logout= (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged out Successfully!');
        res.redirect('/campgrounds');
    });
}