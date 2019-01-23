var mongoose = require('mongoose')
var Schema = mongoose.Schema
var user_schema = new Schema({
    user_type: Number,
    username: String,
    password: String,
    profile_picture_path: String
})

module.exports = mongoose.model('User',user_schema)

// var munverse ='mongodb://localhost/munverse'
// mongoose.connect(munverse)
