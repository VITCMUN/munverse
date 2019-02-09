const passport = require('passport')
const User = require('../models/user.model')
const logger = require('../utils/logger')

exports.welcome_view = (req, res) => {
    var profile_picture_path = req.user.profile_picture_path
    var username = req.user.username
    res.status(200).send({ "view": `welcome ${username}` })
}

exports.login_view = (req, res) => {
    if (req.user) {
        res.status(403).send({ "message": "Already logged in. Logout to continue." })
    }
    else {
        res.status(200).send({ "view": "Log in." })
    }
}

exports.login = (req, res) => { 
    /**
     * Login endpoint
     * Requires: username, password
     */
    if (req.user) {
        res.status(403).send({ "message": "Already logged in. Logout to continue." })
    }
    passport.authenticate('local')(req, res, function(){
        return res.redirect('/')
    })

}

exports.signup_view = (req, res) => {
    if (req.user) {
        res.status(403).send({ "message": "Already logged in. Logout to continue." })
    }
    else {
        res.status(200).send({ "view": "Sign up." })
    }
}

exports.signup = (req, res) => {
    /**
     * Registers a user to the website
     * Requires: username, password, user_type
     * user_type: 0 - delegate, 1 - EB, 2 - admin
     */
    if (req.user) {
        logger.error('User already logged in.')
        res.status(403).send({ "message": "user already logged in." })
    } else if (!(req.body.username && req.body.password && req.body.user_type)) {
        res.status(403).send({ "message": "data not adequate." })
    } else {
        var user = new User({ username: req.body.username, user_type: req.body.user_type })
        User.register(user, req.body.password, (err, user) => {
            if (err) {
                logger.error(err)
                res.status(200).send({ "message": err })
            }
            else {
                passport.authenticate('local')(req, res, function () {
                    logger.info(`New user successfully signed up - ${req.body.username}`)
                    res.redirect('/')
                })
            }
        })
    }
}

exports.logout = (req, res) => {
    req.logout();
    logger.info('User has logged out.')
    res.redirect('/')
}
