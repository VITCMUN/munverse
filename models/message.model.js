var mongoose = require('mongoose')
var Schema = mongoose.Schema

var MessageSchema = new Schema({
    sender: String,
    receiver: String,
//  timestamps: true,
//  bool: String,
    string_content: String,
})


module.exports = mongoose.model('Message', MessageSchema)