var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var event_schema = new Schema({
    event_name: String,
    event_logo_path: String
})

module.exports = mongoose.model('Event',event_schema)

// var munverse ='mongodb://localhost/munverse'
// mongoose.connect(munverse)
