var mongoose = require('mongoose')
var Schema = mongoose.Schema

/**
 * id is always set to 0 for event schema to ensure only one document
 */
var EventSchema = new Schema({
    id: {
        type: Number,
        required: true,
    },
    event_name: {
        type: String,
        required: true,
    },
    event_logo_url: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('Event', EventSchema)