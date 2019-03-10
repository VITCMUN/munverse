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
