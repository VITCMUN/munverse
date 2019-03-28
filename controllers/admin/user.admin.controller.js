const random = require('randomstring')
const passport = require('passport')
const User = require('../../models/user.model')
const logger = require('../../utils/logger')
const base64 = require('../../utils/base64')
const sanitize = require('../../utils/sanitize')
const fs = require('fs')

function redirect_with_error(res, error){
    error.replace(" ", "%20")
    res.redirect(`/?error_user=${error}`)
}

exports.get_users = (req, res) => {
    /** Get all users */
    User.find({}, (err, users) => {
        if (err) {
            logger.error(err)
            res.status(500).send({ "message": err })
        } else {
            res.status(200).send(users)
        }
    })
}

exports.add_user = (req, res) => {
    /**
     * Registers a user to the website
     * Requires: username, password, user_type, profile_picture
     * user_type: 0 - delegate, 1 - EB, 2 - admin
     */ 
    if ((req.body.username == null) || (req.body.password == null) || (req.body.user_type == null) || (req.body.profile_picture == null)) {
        redirect_with_error(res, "data not adequate")
    } else {
        if (!sanitize.valid_name(req.body.username)) {
            redirect_with_error(res, "invalid username")
            return
        }
        if (isNaN(req.body.user_type) || req.body.user_type > 2 || req.body.user_type < 0) {
            redirect_with_error(res, "invalid user type")
            return
        }
        
        var image_data = base64.decode_image(req.body.profile_picture)
        if (!image_data) {
            redirect_with_error(res, "invalid image type")
            return
        }
        var filename = random.generate()
        var profile_picture_path = `${__dirname}/../../media/profile_pictures/${filename}.${image_data.extension}`
        var profile_picture_url = `/profile_pictures/${filename}.${image_data.extension}`
        fs.writeFile(profile_picture_path, image_data.data, (err) => {
            if (err) 
                logger.error(err)
        })
    
        var user = new User({
            username: req.body.username,
            user_type: req.body.user_type,
            profile_picture_url: profile_picture_url,
        })
        User.register(user, req.body.password, (err, _) => {
            if (err) {
                logger.error(err)
                redirect_with_error(res, err.message)
            } else {
                res.redirect('/')
            }
        })
    }
}

exports.update_user = (req, res) => {
    /**
     * Updates user information
     * Necessary: username
     * Optional: password, user_type, profile_picture
     * Limitation: Cannot update password
     */
    update = {}
    if (!req.body.username) {
        redirect_with_error(res, "missing username")
        return
    }
    if (req.body.user_type){
        if(isNaN(req.body.user_type) || req.body.user_type > 2 || req.body.user_type < 0) {
            redirect_with_error(res, "invalid user type")
            return
        } else {
            update.user_type = req.body.user_type
        }
    }
    if (req.body.profile_picture) {
        var image_data = base64.decode_image(req.body.profile_picture)
        if (!image_data) {
            redirect_with_error(res, "invalid image type")
            return
        }
        var filename = random.generate()
        var profile_picture_path = `${__dirname}/../../media/profile_pictures/${filename}.${image_data.extension}`
        var profile_picture_url = `/profile_pictures/${filename}.${image_data.extension}`
        fs.writeFile(profile_picture_path, image_data.data, (err) => {
            if (err)
                logger.error(err)
        })
        update.profile_picture_url = profile_picture_url
    }
    User.findOneAndUpdate({ username: req.body.username },
        {
            $set: update
        },
        { upsert: false }, (err, updated) => {
            if (err) {
                logger.error(err)
                redirect_with_error(res, err.message)
            } else {
                updated.setPassword(req.body.password, (_)=>{
                    res.redirect("/")
                })
            }
        })
}

exports.delete_user = (req, res) => {
    /**
     * Delete user by username
     */
    if (req.body.username) {
        User.findOneAndRemove({ username: req.body.username }, (err, deleted) => {
            if (err) {
                logger.error(err)
                redirect_with_error(res, err.message)
            } else if(deleted) {
                logger.info('Deleted user ' + deleted)
                res.redirect("/")
            } else {
                redirect_with_error(res, "user not found")
            }
        })
    } else {
        redirect_with_error(res, "missing username")
    }
}