$(document).ready(() => {
  var msg = io.connect(document.location.href, {
    reconnection: false
  })

  function sanitize(string) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return string.replace(reg, (match)=>(map[match]));
  }

  var btn = $("#send_message")
  var to = $("#from_user")
  var message = $("#message_box")
  users = {}

  var chat_bubble_part_1 =
    '<div class="column is-full has-text-right"> \
        <div class="talk-bubble tri-right round btm-right-in">\
          <div class="talktext">\
            <p>'

  var chat_bubble_part_2 = "</p></div></div></div>"

  var chat_bubble_part_1_r = 
    '<div class="column is-full">\
        <div class="talk-bubble tri-right round btm-left">\
          <div class="talktext">\
            <p>'
  
  var chat_bubble_part_2_r = '</p></div></div></div>'


  function animateIFrame() {
    $("#message-window")[0].contentWindow.scrollTo( 0, 999999 );
  }

  msg.on("allusers", data => {
    _.each(data.users, (name, id) => {
      users[id] = name
      try {
        $("#" + name + "_status")[0].classList.remove("offline")
        if ($("#from_user").html() == name) {
          // enable columns click again
          columns_click(name)
        }
      }
      catch(err) {}
    })
  })

  msg.on("userdisconnected", data => {
    // delete from front end active user list
    delete users[data.name]
    $("#" + data.name + "_status")[0].classList.add("offline")
    if ($("#from_user").html() == data.name) {
      // enable columns click again
      columns_click(data.name)
    }
  })

  btn.on("click", () => {
    // emit message
    message.val(sanitize(message.val().replace(/^[ \t\n]+|[ \n\t]+$/g, '')))
    if (message.val() == "") {
      return
    } else {
      msg.emit("message", {
        name: to.html(),
        message: message.val()
      })
      // append to window
      $("#message-window")
        .contents()
        .find("body")
        .append(chat_bubble_part_1 + message.val() + chat_bubble_part_2)
      // reset the box value
      message.val("")
      // scroll down
      animateIFrame();
    }
  })

  msg.on("newmessage", data => {
    var threads_window = document.getElementById("threads-window")
    if (threads_window != null) {
      threads_window.contentWindow.location.reload() 
    } else if (data.name == $("#from_user").html()) {
        $("#message-window").contents().find("body").append(chat_bubble_part_1_r + data.message + chat_bubble_part_2_r)
        animateIFrame();
        msg.emit("acknowledge", {
          ack: "ack",
          name: data.name
        })
    }
  })
  msg.on("doubletick", data => {
    console.log(data)
  })
})
