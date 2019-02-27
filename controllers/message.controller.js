var _  = require('lodash')

// required 
exports.getchatroom = (req,res) => {
    // global variable
    user_name = user.username
    res.render("../public/main.html")
}

// load users 
var users = {} // User -> id pairs


exports.connected = (socket) =>{
    socket.emit("allusers",{
        users: users
    })
    users[user_name] = socket.id
    socket.broadcast.emit("userconnected",{
        id : socket.id,
        name : user_name
    })
    //console.log(users)    
}

exports.disconnected = () =>{
    delete users[user_name]
	socket.broadcast.emit('userdisconnected', {
        id: socket.id,
        name: user_name
    })
}

exports.sendmessage = (socket,data) => {
	socket.to(data.id).emit('newmessage', {
        message: data.message,
        name: user_name // get sender name from the UI refer /public/js/chatscript
    })
}

