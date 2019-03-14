const Message = require('../models/message.model')
const logger = require('../utils/logger')
const message_data = require('../renderer/message')

user = null
cache = []

function get_usernames() {
    usernames = []
    console.log(cache)
    for (var i = 0; i < cache.length; i++)
        usernames.push(cache[i][0].username)
    return usernames
}

function get_index(username, socket_id) {
    index = -1
    if (socket_id) {
        for (var i = 0; i < cache.length; i++)
            if (cache[i][1] == socket_id) {
                index = i
                break
            }
    } else if (username) {
        for (var i = 0; i < cache.length; i++)
            if (cache[i][0].username == username) {
                index = i
                break
            }
    }
    return index
}

exports.get_user = (req, res, next) => {
    /** get user for chat */
    user = req.user
    return next()
}

exports.connected = (socket, io) => {
    /** on user connect cache the current socket id **/
    cache.push([user, socket.id])
    io.sockets.emit("allusers", {
        users: get_usernames()
    })
}

exports.disconnected = (socket, io) => {
    index = get_index(null, socket.id)
    user = cache[index][0]
    cache.splice(index, 1);
    io.sockets.emit('userdisconnected', {
        name: user.username
    })
}

exports.sendmessage = (socket, data, io) => {
    try {
        id_to = cache[get_index(data.name, null)][1]
        user_from = cache[get_index(null, socket.id)][0]
        user_to = cache[get_index(null, id_to)][0]
    } catch(err) {
        logger.error(err)
        return
    }
    socket.to(id_to).emit('newmessage', {
        message: data.message,
        name: user_from.username
    })
    var new_message = new Message({
        sender: user_from,
        receiver: user_to,
        ViaEb: 0,
        content: data.message,
    })
    console.log(new_message)
    new_message.save((err, results) => {
        if (err) { logger.error(err) }
    })
}

exports.acknowledge = (socket, data) => {
    id = cache[get_index(data.name, null)][1]
    socket.to(id).emit('doubletick', {
        acknowledge: 'received'
    })
}

exports.get_messages = async (req, res) => {
    username = req.user.username
    from_user = req.query.from_user
    page = req.query.page

    if (from_user == null) {
        res.status(400).send({"message": "from_user missing"})
        return
    } else {
        message_data.get_messages_from_user(username, from_user, page)
        .then((messages)=>{
            console.log(messages)
            res.render('../views/messages', messages)
        })
    }
}
