exports.isAuthenticated = (req, res, next) => {
    if (req.user) {
        return next()
    } else {
        res.render('../views/index')
    }
}

exports.isNotAuthenticated = (req, res, next) => {
    if (req.user) {
        res.redirect('/')
    } else {
        return next()
    }
}

exports.isadmin=(req,res,next) =>{
    if(req.user.user_type==2) {
        return next()
    } else {
        res.status(403).send({"message": "The user is unauthorized."})
    }
}

exports.iseb=(req,res,next)=> {
    if(req.user.user_type==1 || req.user.user_type==2) {
        return next()
    } else {
        res.status(403).send({"message": "The user is unauthorized."})
    }
}

exports.isdelegate=(req,res,next)=> {
    if(req.user.user_type==0 || req.user.user_type==2) {
        return next()
    } else {
        res.status(403).send({"message": "The user is unauthorized."})
    }
}

