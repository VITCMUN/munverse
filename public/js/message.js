var output = document.getElementById('inbox')
var msg = io.connect(document.location.href, {
  reconnection: false
})
var btn = document.getElementById('send')
var to = document.getElementById('receiver')
var message = document.getElementById("send_message")
var user_name = document.getElementById("user")

users = {}
msg.on("userconnected", (data) => {
  users[data.name] = data.name
})
msg.on('allusers', (data) => {

  _.each(data.users, (id, name) => {
    //addUser(id, name)
    users[name] = id
  })
})

msg.on('userdisconnected', (data) => {
  // delete from front end active user list
  delete users[data.name]


})


btn.onclick = (e) => {
  e.preventDefault();
  msg.emit("message", {
    name: to.value,
    message: message.value
  })
  console.log("emit")
}

msg.on("newmessage", (data) => {
  output.innerHTML += "<p>" + data.name + " says " + data.message + "</p>"
  msg.emit('acknowledge', {
    ack: 'ack',
    name: data.name
  })
  //  console.log('ack')

})
msg.on('doubletick', (data) => {
  console.log(data)
})
