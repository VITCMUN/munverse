const Message = require('../models/message.model')
const logger = require('../utils/logger')

user = null
cache = []

function get_usernames() {
    usernames = []
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

exports.get_user = (req, res) => {
    /** get user for chat */
    user = req.user
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
    delete cache[index]
    io.sockets.emit('userdisconnected', {
        name: user.username
    })
}

exports.sendmessage = (socket, data, io) => {
    id_to = cache[get_index(data.name, null)][1]
    user_from = cache[get_index(null, socket.id)][0]
    user_to = cache[get_index(null, id_to)][0]
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
