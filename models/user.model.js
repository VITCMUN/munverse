var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	user_type: String,
	username : {type : String,required : true ,maxlength : 100},
	password :String,
	profile_picture_path : String
})



module.exports = mongoose.model('User',UserSchema);

