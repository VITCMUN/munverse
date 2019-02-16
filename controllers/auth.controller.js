const passport = require('passport')
const User = require('../models/user.model')
const logger = require('../utils/logger')

exports.home_view = (req, res) => {
    /** view function for home page */
    if (req.user.user_type == 2)
        res.status(200).send({ "view": `Welcome administrator ${req.user.username}` })
    else
        res.status(200).send({ "view": `Welcome ${req.user.username}!` })
}

exports.login_view = (req, res) => {
    /** view function for login page */
    if (req.user) {
        res.redirect("/")
    } else {
        res.render('../views/login')
    }
}

exports.login = (req, res) => { 
    /**
     * login endpoint
     * requires: username, password
     */
    if (req.user) {
        res.status(403).send({ "message": "Already logged in. Logout to continue." })
    }
    passport.authenticate('local')(req, res, function(){
        return res.redirect('/')
    })

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
    } else if (req.body.username === null || req.body.password === null || req.body.user_type === null) {
        res.status(400).send({ "message": "data not adequate." })
    } else {
        var user = new User({ username: req.body.username, user_type: req.body.user_type })
        User.register(user, req.body.password, (err, _) => {
            if (err) {
                logger.error(err)
                res.status(403).send({ "message": err })
            } else {
                passport.authenticate('local')(req, res, function () {
                    logger.info(`New user successfully signed up - ${req.body.username}`)
                    res.redirect('/')
                })
            }
        })
    }
}

exports.logout = (req, res) => {
    /** logout */
    if (req.user) {
        logger.info(`${req.user.username} is logging out.`)
        req.logout();
        res.redirect('/')
    } else {
        res.status(400).send({ "message": "Login first!" })
    }
}
