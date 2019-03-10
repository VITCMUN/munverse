const chat = require('../controllers/message.controller')
module.exports = (io) => {

  io.on('connect', (socket) => {
    chat.connected(socket, io)

    socket.on('disconnect', (socket) => {
      chat.disconnected(socket, io)
    })

    socket.on('message', (data) => {
      chat.sendmessage(socket, data, io)
    })
    socket.on('acknowledge', (data) => {
      chat.acknowledge(socket, data)
    })
  })
}
