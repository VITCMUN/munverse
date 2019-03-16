const Event = require('../models/event.model')
const Council = require('../models/council.model')
const User = require('../models/user.model')
const Message = require('../models/message.model')

exports.shared_data = async (username) => {
    data = { event: null, council: null, user: null }
    await Event.findOne({ id: 0 }, (err, event) => {
        if (err) { logger.error(err) }
        if (event == null) event = new Event({ id: 0, event_name: 'missing', event_logo_url: '/media/placeholder' })
        data.event = event
    })
    await Council.findOne({ id: 0 }, (err, council) => {
        if (err) { logger.error(err) }
        if (council == null) council = new Council({ id: 0, council_name: 'missing', council_logo_url: '/media/placeholder' })
        data.council = council
    })
    await User.findOne({username: username}, (err, user) => {
        if (err) { logger.error(err) }
        data.user = user
    })
    return data;
}