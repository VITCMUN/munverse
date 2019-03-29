const Message = require('../models/message.model')
const logger = require('../utils/logger')
const message_renderer = require('../renderer/message.renderer')
const shared_renderer = require('../renderer/shared.renderer')
user = null
cache = []

function get_usernames() {
    usernames = []
    for (var i = 0; i < cache.length; i++)
        usernames.push(cache[i][0].username)
    return usernames
}

async function sendToEBs(socket, message, user_from, user_to) {
    for (var i=0; i<cache.length; i++) {
        if (cache[i][0].user_type == 1) {   // EB
            socket.to(cache[i][1]).emit('newmessage', {
                message: message,
                from: user_from.username,
                to: user_to.username
            })
            var new_message = new Message({
                sender: user_from,
                receiver: user_to,
                ViaEb: 1,
                content: message,
            })
            new_message.save()
        }
    }
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

exports.sendmessage = async (socket, data, io) => {
    try {
        id_to = cache[get_index(data.name, null)][1]
        user_from = cache[get_index(null, socket.id)][0]
        user_to = cache[get_index(null, id_to)][0]
        // eb = cache[get_index("EB1", null)][1]
    } catch(err) {
        logger.error(err)
        return
    }
    socket.to(id_to).emit('newmessage', {
        message: data.message,
        name: user_from.username,
        viaeb: data.viaeb
    })
    var new_message = new Message({
        sender: user_from,
        receiver: user_to,
        ViaEb: data.viaeb,
        content: data.message,
    })
    new_message.save()
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
    viaeb = req.query.viaeb
    if (from_user == null) {
        res.status(400).send({"message": "from_user missing"})
    } else {
        if (req.user.user_type == 1 && viaeb == 1) {
          await message_renderer.get_messages_from_user_via_eb(from_user, page)
          .then((messages)=>{
              res.render('../views/messages', {messages: messages, from_user: from_user})
          })
        } else {
          await message_renderer.get_messages_from_user(username, from_user, page)
          .then((messages)=>{
              res.render('../views/messages', {messages: messages, from_user: from_user})
          })
        }
    }
}

exports.get_threads = async (req, res) => {
    username = req.user.username
    if (username == null) {
        res.status(400).send({"message": "user missing"})
        return
    } else {
        data = {}
        await shared_renderer.shared_data(username)
            .then((shared_data) => {
                data = shared_data
            }).catch((err) => {
                logger.error(err)
            })
        await message_renderer.get_message_list(username)
            .then((message_data) => {
                data.messages = message_data
            }).catch((err) => {
                logger.error(err)
            })
        res.render('../views/threads', data);
    }
}
