//const Message = require('../models/message.model')
const User = require('../models/user.model')
const Message = require('../models/message.model')
const logger = require('../utils/logger')
const auth_cont = require("../controllers/auth.controller")
const passport = require('passport')
const auth_route = require('../routes/auth.route')
//var uniqid = require('uniqid')
users = {} // User -> id pairs

user = null
user_id = {}
exports.get_user = (req, res) => {
  /**get user for chat */
  user = req.user
}


exports.connected = (socket, io) => {
  /** on user connect cache the current socket id**/
  users[user.username] = [socket.id, user]
  user_id[socket.id] = user.username
  io.sockets.emit("allusers", {
    users: Object.keys(users)
  })
  console.log("users  " + users)
  console.log("user_id " + user_id)

}

exports.disconnected = (socket, io) => {
  delete users[user.username]
  io.sockets.emit('userdisconnected', {
    name: user.username
  })
}


exports.sendmessage = (socket, data, io) => {
  data.id = users[data.name][0]
  socket.to(data.id).emit('newmessage', {
    message: data.message,
    name: user_id[socket.id]
  })

  var new_message = new Message({
    sender: user_id[socket.id],
    receiver: user_id[data.id],
    ViaEb: 0,
    content: data.message,
  })
  console.log(new_message)
  new_message.save((err, results) => {
    logger.error(err)
    console.log(results)
  })
}
exports.acknowledge = (socket, data) => {
  data.id = users[data.name][0]
  socket.to(data.id).emit('doubletick', {
    acknowledge: 'recived'
  })
  console.log("recived")

}
