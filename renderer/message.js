const Message = require('../models/message.model')
const User = require('../models/user.model')
const logger = require('../utils/logger')

exports.get_message_list = async (sender_username) => {
    /**
     * get list of all message that have sent a message to sender or vice versa
     */
    var all_users = await User.find({'username': {$ne: sender_username}})
    messages = {}
    for (var i=0; i<all_users.length; i++) {
        message = await Message.findOne(
            {
                'sender.username': sender_username,
                'receiver.username': all_users[i].username
            }).sort({'createdAt': -1})
        if (message)
            messages[all_users[i].username] = message
        message = await Message.findOne(
            {
                'receiver.username': sender_username,
                'sender.username': all_users[i].username
            }).sort({'createdAt': -1})
        if (message) {
            if (messages[all_users[i].username]) {
                if (messages[all_users[i].username].createdAt < message.createdAt) {
                    messages[all_users[i].username] = message
                }
            } else 
                messages[all_users[i].username] = message
        }
    }
    console.log(Object.values(messages))
    return Object.values(messages)
}

exports.get_messages_from_user = async (user, from_user, page) => {
    /**
     * get messages for user from from_user
     * message range: page x 10 + page x 10 + 10
     */
    page_size = 10
    if (!page) { page = 0 }
    messages_data = []
    await Message.find({ $or: [{"sender.username": user}, {"sender.username": from_user}]})
        .sort({ 'createdAt': -1 })
        .skip(page * page_size)
        .limit(page_size)
        .exec((err, messages) => {
            if (err) { logger.error(err) }
            messages_data = messages
    })
    return messages_data
}