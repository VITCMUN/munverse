// routes

// socketController
// dbController

const socketController = require("./controllers/socketController")

module.exports = function(app, io) {
// add routes based on front end

    //IO listeners
    io.on('connect', function(socket) {
    	socketController.connected(socket)
    	socket.on('disconnect', function() {
    		socketController.disconnected(socket)
    	})
        socket.on('message', function(data) {
            socketController.sendmessage(socket, data)
        })
    })
}
