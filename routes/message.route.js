const express = require('express')
const router = express.Router()
const message_controller = require('../controllers/message.controller')



router.get('/chatroom', message_controller.getchatroom)

//Io listeners
io.on('connect', (socket) => {
    chat.connected(socket) 

    socket.on('disconnect', () => {
        chat.disconnected(socket)
    })

    socket.on('new message', (data) => {
        chat.sendmessage(socket, data)
    })
})

