const Message = require('../models/message.model')
const logger = require('../utils/logger')

exports.get_user_list = async (sender) => {
    /**
     * get list of all users that have sent a message to sender
     */
    await Message.find({ sender: sender }).distinct('receiver', (err, users) => {
        if (err) { logger.error(err) }
        return users
    })
}

exports.get_messages_from_user = async (user, from_user, page) => {
    /**
     * get messages for user from from_user
     * message range: page x 10 + page x 10 + 10
     */
    page_size = 10
    if (!page) { page = 0 }
    await Message.find({ sender: { $in: [user, from_user] } })
        .sort({ 'createdAt': -1 })
        .skip(page * page_size)
        .limit(page_size)
        .exec((err, messages) => {
            if (err) { logger.error(err) }
            return messages
    })

}