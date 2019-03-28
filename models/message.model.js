const mongoose = require('mongoose');
const User = require("../models/user.model")
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
	sender : User.schema,
	receiver : User.schema,
	ViaEb : Boolean,
	content : {
		type: String,
		maxlength: 250
	}
},{ timestamps: true})

module.exports = mongoose.model('Message', MessageSchema)