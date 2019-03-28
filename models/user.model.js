var mongoose = require('mongoose')
var Schema = mongoose.Schema
var passportLocalMongoose = require('passport-local-mongoose')

/**
 * user_type - 0 delegate, 1 executive board, 2 admin
 */
var UserSchema = new Schema({
    user_type: {
        type: Number,
        min: 0,
        max: 2,
        required: true,
    },
    username: {
        type: String,
        // unique: true,
        required: true,
    },
    profile_picture_url: {
        type: String,
        required: true,
    },
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)
