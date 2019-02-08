// routes

// socketController
// dbController

const socketController = require("./controllers/socketController.js")

module.exports = (app, io)=> {
// add routes based on front end

    //IO listeners
    io.on('connect', (socket) => {
    	socketController.connected(socket)
    	socket.on('disconnect', ()=> {
    		socketController.disconnected(socket)
    	})
        socket.on('message', (data) =>{
            socketController.sendmessage(socket, data)
        })
    })
}
