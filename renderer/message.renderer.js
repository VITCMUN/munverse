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
            })
            .sort({'createdAt': -1})
        if (message) {
            messages[all_users[i].username] = message
        }
        message = await Message.findOne(
            {
                'receiver.username': sender_username,
                'sender.username': all_users[i].username
            })
            .sort({'createdAt': -1})
        if (message) {
            if (messages[all_users[i].username]) {
                if (messages[all_users[i].username].createdAt < message.createdAt) {
                    messages[all_users[i].username] = message
                }
            } else
                messages[all_users[i].username] = message
        }
    }
    return Object.values(messages)
}

exports.get_messages_from_user = async (user, from_user, page) => {
    /**
     * get messages for user from from_user
     * message range: page x 10 + page x 10 + 10
     */
    page_size = 10
    if (!page) { page = 0 }
    return await Message.find(
        {
            $or:
            [
                {$and: [
                    {"sender.username": from_user},
                    {"receiver.username": user}]},
                {$and: [
                    {"sender.username": user},
                    {"receiver.username": from_user}
                ]}
            ]
        })
        .sort({ 'createdAt': -1 })
        .skip(page * page_size)
        .limit(page_size)
}

exports.get_messages_from_user_via_eb = async (from_user, page) => {
    /**
     * get all messages from from_user via eb
     * message range: page x 10 + page x 10 + 10
     */
    page_size = 10
    if (!page) { page = 0 }
    return await Message.find(
        {
            $or:
            [
                {$and: [
                    {"ViaEb": true},
                    {"sender.username": from_user},
                    ]},
                {$and: [
                    {"ViaEb": true},
                    {"receiver.username": from_user}
                ]}
            ]
        })
        .sort({ 'createdAt': -1 })
        .skip(page * page_size)
        .limit(page_size)
}
