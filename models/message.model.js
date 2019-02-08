const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const User = require("../models/user.model")

var date = new Date();

var MessageSchema = new Schema({
	sender :  User.schema,
	receiver :  User.schema,
	// timestamp : 
	ViaEb : Boolean,
	content : String,

})



module.exports = mongoose.model('Message',MessageSchema)

