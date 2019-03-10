var mongoose = require('mongoose')
var Schema = mongoose.Schema

/**
 * id is always set to 0 for council schema to ensure only one document
 */
var CouncilSchema = new Schema({
    id: {
        type: Number,
        required: true,
    },
    council_name: {
        type: String,
        required: true,
    },
    council_logo_url: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('Council', CouncilSchema)