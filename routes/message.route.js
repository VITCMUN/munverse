const express = require('express')
const router = express.Router()
const middleware = require('../middlewares/auth.middleware')
const chat = require('../controllers/message.controller')
const message_controller = require('../controllers/message.controller')

router.get('/', middleware.is_authenticated_with_404_fallback, message_controller.get_messages)
router.get('/threads', middleware.is_authenticated, message_controller.get_threads)
exports.router = router

exports.io = (io) => {

  io.on('connect', (socket) => {
    chat.connected(socket, io)

    socket.on('disconnect', () => {
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
