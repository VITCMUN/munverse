const User = require('../models/user.model')
const logger = require('../utils/logger')
const shared_renderer = require('./shared')

exports.admin_data = async () => {
    data = { council: null, event: null, users: null }
    await User.find({ user_type: { $lte: 1 } }, (err, users) => {
        if (err) { logger.error(err) }
        data.users = users
    })
    await shared_renderer.shared_data()
        .then((sdata) => {
            data.council = sdata.council
            data.event = sdata.event
        })
    return data
}