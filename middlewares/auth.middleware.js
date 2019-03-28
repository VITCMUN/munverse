const logger = require('../utils/logger')

exports.is_authenticated = (req, res, next) => {
    if (req.user) {
        return next()
    } else {
        res.redirect('/login')
    }
}

exports.is_authenticated_with_404_fallback = (req, res, next) => {
    if (req.user) {
        return next()
    } else {
        res.status(403).send("")
    }
}

exports.is_admin = (req, res, next) => {
    if (req.user && req.user.user_type == 2) {
        return next()
    } else {
        logger.error('User is unauthorized')
        res.status(403).send({ "message": "User is unauthorized." })
    }
}

exports.is_eb = (req, res, next) => {
    if (req.user && req.user.user_type == 1) {
        return next()
    } else {
        logger.error('User is unauthorized')
        res.status(403).send({ "message": "User is unauthorized." })
    }
}

exports.is_delegate = (req, res, next) => {
    if (req.user && req.user.user_type == 0) {
        return next()
    } else {
        logger.error('User is unauthorized')
        res.status(403).send({ "message": "User is unauthorized." })
    }
}
