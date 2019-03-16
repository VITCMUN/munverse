const passport = require('passport')
const User = require('../models/user.model')
const logger = require('../utils/logger')
const admin_renderer = require('../renderer/admin.renderer')
const shared_renderer = require('../renderer/shared.renderer')
const message_renderer = require('../renderer/message.renderer')

// /get-messages/?from=Pakistan
exports.home_view = async (req, res) => {
    /** view function for home page */
    if (req.user.user_type == 2) {
        await admin_renderer.admin_data().then((data) => {
            data.error_event = req.query.error_event
            data.error_council = req.query.error_council
            res.render('../views/admin', data)
        }).catch((err) => {
            logger.error(err)
            res.status(500).send({ "message": "error rendering page" })
        })
    } else {
        data = {}
        await shared_renderer.shared_data(req.user.username)
            .then((shared_data) => {
                data = shared_data
            }).catch((err) => {
                logger.error(err)
            })
        await message_renderer.get_message_list(req.user.username)
            .then((message_data) => {
                data.messages = message_data
            }).catch((err) => {
                logger.error(err)
            })
        res.render('../views/inbox', data);   
    }
}

exports.login_view = (req, res) => {
    /** view function for login page */
    if (req.user) {
        res.redirect("/")
    } else {
        shared_renderer.shared_data().then((data) => {
            res.render('../views/login', data)
        }).catch((err) => {
            logger.error(err)
            res.status(500).send({ "message": "error rendering page" })
        })
    }
}

exports.login = (req, res) => {
    /**
     * login endpoint
     * requires: username, password
     */
    if (req.user) {
        res.status(403).send({ "message": "Already logged in. Logout to continue." })
    } else {
        passport.authenticate('local')(req, res, function () {
            return res.redirect('/')
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


exports.signup = (req, res) => {
    /**	
     * Registers a user to the website	
     * Requires: username, password, user_type, profile_picture_url
     * user_type: 0 - delegate, 1 - EB, 2 - admin	
     */
    if (req.user) {
        logger.error('User already logged in.')
        res.status(403).send({ "message": "user already logged in." })
    } else if (req.body.username === null || req.body.password === null || req.body.user_type === null) {
        res.status(400).send({ "message": "data not adequate." })
    } else {
        var user = new User({ username: req.body.username, user_type: req.body.user_type, profile_picture_url: req.body.profile_picture_url })
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