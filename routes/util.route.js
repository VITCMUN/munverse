exports.isAuthenticated = function (req, res, next) {
    if (req.user) {
        return next()
    } else {
        res.render('../views/index')
    }
}

exports.isNotAuthenticated = function(req, res, next) {
    if (req.user) {
        res.redirect('/')
    } else {
        return next()
    }
}