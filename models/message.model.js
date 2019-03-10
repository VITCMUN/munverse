const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const User = require("../models/user.model")
var MessageSchema = new Schema({
	sender : String,
	receiver : String,
	//new Date().toLocaleTimeString('en-US',{hour12:true}),
	ViaEb :{type: Boolean},
	content : {type:String}
},{ timestamps: true})
module.exports = mongoose.model('message',MessageSchema)
