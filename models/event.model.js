const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EventSchema = new Schema({
	event_name : String,
	event_logo_path : String,
})

module.exports = mongoose.model("Event",EventSchema);
