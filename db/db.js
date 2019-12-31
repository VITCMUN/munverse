const logger = require('../utils/logger')
const mongoose = require('mongoose')

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

exports.init = () => {
    mongoose.connect(url, options).then(() => {
        logger.info(`Connected to MongoDB: ${MONGO_HOSTNAME}`)
    }).catch((err) => {
        logger.error(`Error connecting to MongoDB at ${url}: ${err}`)
    })
}