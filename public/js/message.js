$(document).ready(() => {
  var msg = io.connect(document.location.href, {
    reconnection: false
  });

  var btn = $(".send");
  var to = $("#from_user");
  var message = $(".message-input");
  var user_name = $("#current_user");
  console.log(btn, to, message, user_name);
  users = {};

  var chat_bubble_part_1 =
    '<div class="column is-full has-text-right"> \
        <div class="talk-bubble tri-right round btm-right-in">\
          <div class="talktext">\
            <p>';

  var chat_bubble_part_2 = "</p></div></div></div>";

  var chat_bubble_part_1_r = 
    '<div class="column is-full">\
        <div class="talk-bubble tri-right round btm-left">\
          <div class="talktext">\
            <p>'
  
  var chat_bubble_part_2_r = '</p></div></div></div>'
     

  msg.on("userconnected", data => {
    users[data.name] = data.name;
  });

  msg.on("allusers", data => {
    _.each(data.users, (id, name) => {
      //addUser(id, name)
      users[name] = id;
    });
  });

  msg.on("userdisconnected", data => {
    // delete from front end active user list
    delete users[data.name];
  });

  btn.on("click", () => {
    console.log(btn, to.html(), message.val(), user_name.html());
    msg.emit("message", {
      name: to.html(),
      message: message.val()
    });
    $("iframe")
      .contents()
      .find("body")
      .append(chat_bubble_part_1 + message.val() + chat_bubble_part_2);
    message.val() = "";
    console.log("emit");
  });

  msg.on("newmessage", data => {
    var message_thread = $("#"+data.name)
    console.log(message_thread, data);
    $("iframe")
      .contents()
      .find("body")
      .append(chat_bubble_part_1_r + data.message + chat_bubble_part_2_r);
    message_thread.html(data.message)
    msg.emit("acknowledge", {
      ack: "ack",
      name: data.name
    });
    //  console.log('ack')
  });
  msg.on("doubletick", data => {
    console.log(data);
  });
});
