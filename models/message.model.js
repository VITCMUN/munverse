const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const User = require("../models/user.model")
var MessageSchema = new Schema({
	sender :  User.schema,
	receiver :  User.schema,
	timestamp : new Date().toLocaleTimeString('en-US',{hour12:true}),
	ViaEb : Boolean,
	content : String,

})



module.exports = mongoose.model('Message',MessageSchema)

