const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CouncilSchema = new Schema({
	council_name : String,
	council_banner_path : String,
})

module.exports = mongoose.model("Council",CouncilSchema);