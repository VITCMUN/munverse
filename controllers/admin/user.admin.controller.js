const User = require('../../models/user.model')
const logger = require('../../utils/logger')
const random = require('randomstring')
const base64 = require('../../utils/base64')
const sanitize = require('../../utils/sanitize')
const fs = require('fs')

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
    if (!(req.body.username && req.body.password && req.body.user_type && req.body.profile_picture)) {
        res.status(400).send({ "message": "data not adequate." })
    } else {
        if (!sanitize.valid_name(req.body.username)) {
            res.status(400).send({ "message": "invalid username" })
            return
        }
        if (isNan(req.body.user_type) || req.body.user_type > 2 || req.body.user_type < 0) {
            res.status(400).send({ "message": "invalid user_type" })
            return
        }
        var image_data = base64.decode_image(req.body.profile_picture)
        if (!image_data) {
            res.status(400).send({ "message": "invalid image type" })
            return
        }
        var filename = random.generate()
        var profile_picture_path = `../media/profile_pictures/${filename}.${image_data.extension}`
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
                res.status(403).send({ "message": err })
            } else {
                passport.authenticate('local')(req, res, function () {
                    logger.info(`new user successfully signed up - ${req.body.username}`)
                    res.redirect('/')
                })
            }
        })
    }
}

exports.update_user = (req, res) => {
    /**
     * Updates user information
     * Optional: username, password, user_type, profile_picture
     */
    if (!req.body.username) {
        res.status(400).send({ "message": "username missing" })
        return
    }
    if (isNan(req.body.user_type) || req.body.user_type > 2 || req.body.user_type < 0) {
        res.status(400).send({ "message": "invalid user_type" })
        return
    }
    var image_data = base64.decode_image(req.body.profile_picture)
    if (!image_data) {
        res.status(400).send({ "message": "invalid image type" })
        return
    }
    var filename = random.generate()
    var profile_picture_path = `../media/profile_pictures/${filename}.${image_data.extension}`
    var profile_picture_url = `/profile_pictures/${filename}.${image_data.extension}`
    fs.writeFile(profile_picture_path, image_data.data, (err) => {
        if (err)
            logger.error(err)
    })
    User.findOneAndUpdate({ username: req.body.username },
        {
            $set: {
                user_type: req.body.user_type,
                profile_picture_url: profile_picture_url
            }
        },
        { upsert: false }, (err, updated) => {
            if (err) {
                logger.error(err)
                res.status(403).send({ "message": err })
            } else {
                updated.password = req.body.password
                updated.save()
                res.status(200).send(updated)
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
                res.status(403).send(err)
            } else {
                logger.info('Deleted user ' + deleted)
                res.status(200).send('Deleted successful!')
            }
        })
    } else {
        res.status(400).send({ "message": "missing username" })
    }
}