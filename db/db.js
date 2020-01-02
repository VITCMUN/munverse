const logger = require('../utils/logger')
const mongoose = require('mongoose')
const User = require('../models/user.model')

const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB
} = process.env

const options = {
    useCreateIndex: true, 
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500, 
    connectTimeoutMS: 10000,
}

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`

var createDefaultAdminUser = () => {
    User.find({}, (err, users) => {
        if (err) { logger.error(err) }
        // create admin user if there is no user
        if (users.length == 0) {
            var username = process.env.MUNVERSE_ADMIN_USERNAME || "admin"
            var password = process.env.MUNVERSE_ADMIN_PASSWORD || "password"
            var profile_picture_url = process.env.MUNVERSE_ADMIN_URL || "/media/profile/admin.png"
            var user = new User({
                username: username,
                user_type: 2, 
                profile_picture_url: profile_picture_url 
            })
            User.register(user, password, (err, _) => {
                if (err) {
                    logger.error(err)
                } else {
                    logger.info(`Created admin user ${username}`)
                }
            })
        }
    })   
}

exports.init = () => {
    mongoose.connect(url, options).then(() => {
        logger.info(`Connected to MongoDB: ${MONGO_HOSTNAME}`)
        createDefaultAdminUser()
    }).catch((err) => {
        logger.error(`Error connecting to MongoDB at ${url}: ${err}`)
    })
}