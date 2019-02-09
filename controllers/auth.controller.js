const passport = require('passport')
const User = require('../models/user.model')
const logger = require('../utils/logger')

// Welcome_page_view function
exports.welcome_view = (req,res) => {
    var profile_picture_path= req.user.profile_picture_path
    var username = req.user.username
    // Render welcome page
    res.status(200).send({"message": `welcome ${username}`})
}

// Login_page_view function(Authentication)
exports.login_view = (req, res) => {
    if(req.user){
        res.status(403).send({"message": "Already logged in. Logout to continue."})
    }
    else{
        res.status(200).send({"message": "Log in view."})
    }
}

// Login function(Authentication)
exports.login = (req, res) => {
    if (req.user){
        res.status(403).send({"message": "Already logged in. Logout to continue."})
    }
    else{
        passport.authenticate('local', { failureRedirect:'/login' }) (req, res, function(){
            logger.info('User successfully logged in. Username: '+req.user.username)
            res.redirect('/')
        })
    }
}

// Signup_page_view function(Authentication)
exports.signup_view = (req,res) => {
    if(req.user){
        res.status(403).send({"message": "Already logged in. Logout to continue."})
    }
    else{
        //Render Signup_page
    }
}

// Signup function(Authentication)
exports.signup = (req, res) => {
    if (req.user){
        logger.error('Cannot sign up. Logout to continue.')
        res.status(403).send({"message": "Cannot sign up. Logout to continue."})
    }
    else {
        var user = new User({username: req.body.username,user_type: req.body.user_type})
        User.register(user,req.body.password,(err, user) => {
            if(err){
                logger.error('A user with the given username is already registered.')
                res.status(304).send({"message": "A user with the given username is already registered."})
            }
            else{
                passport.authenticate('local')(req, res, function(){
                    logger.info('New user successfully signed up. Username:- '+user.username)
                    res.redirect('/')
                })
            }
        })
    }
}

// Logout Function(Authentication)
exports.logout = (req, res) => {
    req.logout();
    logger.info('User has logged out.')
    res.redirect('/')
}
