var mongoose = require('mongoose')
const Message = require("../models/message.model")
const User = require("../models/user.model")



var users = {} //Map: id -> name of the user

//New connected user
exports.connected = function(socket) {
    //Give the new user a list of the existing connected users.
    socket.emit('allusers', {
        users: users
    })
    //Add the new user to our map.
    users[socket.id] = socket.id

    // add User to schema as soon as connected
    var new_user = new User({
        username : socket.id
    })

    new_user.update()


    //Broadcast the new user his id to the existing users.
    //He does not have a name yet.
    socket.broadcast.emit('userconnected', {
        id: socket.id
    })
}

//A user disconnected.
exports.disconnected = function(socket) {
    //Delete the user from the map.
    delete users[socket.id]
    //Broadcast to the existing users.
    socket.broadcast.emit('userdisconnected', {
        id: socket.id
    })
}



//A user sent a message to another user.
exports.sendmessage = function(socket, data) {
    socket.to(data.id).emit('newmessage', {
        message: data.message,
        name: users[socket.id]
    })

    var Message = new Message{
        sender = socket.id,
        receiver :  data.id,
    // timestamp : 
        ViaEb : data.ViaEb,
        content : data.message,
    }

    Message.save()
}
