//This file contains the schema for council

var mongoose =require('mongoose')
var Schema = mongoose.Schema

var council_schema= new Schema({
    council_name: String,
    council_banner_path:String
})

module.exports = mongoose.model('council',council_schema)


// var munverse ='mongodb://localhost/munverse'
// mongoose.connect(munverse)
