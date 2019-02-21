const express = require('express')
const message_controller = require('../controllers/message.controller')

exports.module = (app,io) => {


app.get("/", (req,res) => {
	// render chat room view page
})

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

}
