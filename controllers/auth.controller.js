const passport = require('passport')
const User = require('../models/user.model')

exports.index = (req, res) => {
    res.render('../views/welcome', {user: req.user})
}
// This function is used to fo loging purpose(Authentication)
exports.login = (req, res) => {
    if (req.user)
        res.status(403).send({"message": "Already logged in. Logout to continue."})
    else
        passport.authenticate('local')(req, res, function(){
            res.redirect('/')
        })
}
// This function called when unauthenticate user trys to login
exports.login_page = (req, res) => {
    res.render('../views/login', {error: req.query.error})
}

exports.admin=(req,res) => {
    if(req.user)
        res.status(200).send({"message": "The user is admin."})
}

// This function is called for signing a new user
exports.signup = (req, res) => {
    if (req.user) 
        res.status(403).send({"message": "Cannot sign up. Logout to continue."})
    else {
        var user = new User({username: req.body.username,user_type: req.body.user_type})
        
        User.register(user,req.body.password, function (err, user) {
                if (err) {
                //  console.log("Error registering user", err)
                    res.status(304).send({"message": "A user with the given username is already registered."})
                } else {
                    console.log(`Registered user - ${user.username}.`)
                    passport.authenticate('local')(req, res, function(){
                        console.log('Done')
                        res.redirect('/')
                    })
                }      
        })
    }

}

// This is used when user directly tries to access signup page
exports.signup_page = (req, res) => {
    res.render('../views/signup', {error: req.query.error})
}
// This is called whenever logout is pressed
exports.logout = (req, res) => {
    req.logout();
    res.redirect('/')
}