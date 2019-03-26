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
  var threads_window = document.getElementById("threads-window")
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
    for(var i=0;i<Object.keys(users);i++){
      if (users[i] == data.name) {
        delete users[i];
        break;
      }
    }
    $("#" + data.name + "_status")[0].classList.add("offline")
    if ($("#from_user").html() == data.name) {
      // enable columns click again
      columns_click(data.name)
    }
  })

  btn.on("click", () => {
    // emit message
    var checkBox= document.getElementById("via-eb-input")
    var viaeb=0
    if (checkBox.checked == true)
        viaeb=1
    message.val(sanitize(message.val().replace(/^[ \t\n]+|[ \n\t]+$/g, '')))
    if (message.val() == "") {
      return
    } else {
      msg.emit("message", {
        name: to.html(),
        message: message.val(),
        viaeb: viaeb
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
      // refresh threads window
      threads_window.contentDocument.location.reload(true);
    }
  })

  msg.on("viaeb",data=>{
    console.log(data)
  })

  msg.on("newmessage", data => {
    threads_window.contentDocument.location.reload(true);
    if (data.name == $("#from_user").html()) {
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
