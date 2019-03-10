const Event = require('../models/event.model')
const Council = require('../models/council.model')
const User = require('../models/user.model')
const logger = require('../utils/logger')

exports.admin_data = async () => {
    data = { council: null, event: null, users: null }
    await User.find({ user_type: { $lte: 1 } }, (err, users) => {
        if (err) { logger.error(err) }
        data.users = users
    })
    await exports.shared_data()
        .then((sdata) => {
            data.council = sdata.council
            data.event = sdata.event
        })
    return data
}

exports.shared_data = async () => {
    data = { event: null, council: null }
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
    return data;
}