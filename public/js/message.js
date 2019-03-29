$(document).ready(() => {
  var msg = io.connect(document.location.href, {
    reconnection: false
  });

  function sanitize(string) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "/": "&#x2F;"
    };
    const reg = /[&<>/]/gi;
    return string.replace(reg, match => map[match]);
  }

  function space_to_underscore(username) {
    return username.replace(" ", "_");
  }

  function underscore_to_space(username) {
    return username.replace("_", " ");
  }

  var from = $("#current_user");
  var to_user_type = $("#from_user_type");
  var from_user_type = $("#user_type");
  var btn = $("#send_message");
  var to = $("#from_user");
  var message = $("#message_box");
  var threads_window = document.getElementById("threads-window");
  users = {};

  var chat_bubble_part_1 =
    '<div class="column is-full has-text-right"> \
        <div class="talk-bubble tri-right round btm-right-in">\
          <div class="talktext">\
            <p>';

  var chat_bubble_part_2 = "</p></div></div></div>";

  var chat_bubble_part_r_1 =
    '<div class="column is-full">\
        <div class="talk-bubble tri-right round btm-left">\
          <div class="talktext">\
            <p>';

  var chat_bubble_part_r_2 = "</p></div></div></div>";

  function animateIFrame() {
    $("#message-window")[0].contentWindow.scrollTo(0, 999999);
  }

  msg.on("allusers", data => {
    _.each(data.users, (name, id) => {
      users[id] = name;
      try {
        $("#" + space_to_underscore(name) + "_status")[0].classList.remove(
          "offline"
        );
        if ($("#from_user").html() == name) {
          columns_click(name);
        }
      } catch (err) {}
    });
  });

  msg.on("userdisconnected", data => {
    // delete from front end active user list
    for (var i = 0; i < Object.keys(users); i++) {
      if (users[i] == data.name) {
        delete users[i];
        break;
      }
    }

    $("#" + space_to_underscore(data.name) + "_status")[0].classList.add(
      "offline"
    );
    if ($("#from_user").html() == data.name) {
      // enable columns click again
      columns_click(data.name);
    }
  });

  btn.on("click", () => {
    // emit message
    var checkBox = document.getElementById("via-eb-input");
    var viaeb = checkBox.checked == 1 ? true : false;
    message.val(sanitize(message.val().replace(/^[ \t\n]+|[ \n\t]+$/g, "")));
    if (message.val() == "") {
      return;
    } else {
      msg.emit("message", {
        name: to.html(),
        message: message.val(),
        viaeb: viaeb
      });
      // append to window
      if (
        !viaeb ||
        to_user_type.html() == "1" ||
        from_user_type.html() == "1"
      ) {
        $("#message-window")
          .contents()
          .find("body")
          .append(
            chat_bubble_part_1 +
              message.val() +
              `<p style="text-align: right; font-size: 12px">
            <span class="msg-timestamp">
            ${new Date().getHours()}:${new Date().getMinutes()}
          </span><i class="fa fa-check" aria-hidden="true"></i>      
          </p>` +
              chat_bubble_part_2
          );
      } else {
        $("#message-window")
          .contents()
          .find("body")
          .append(
            chat_bubble_part_1 +
              `<i>via eb</i>\
        <p>From: <b>${from.html()}</b><br></p>\
        <p>To: <b>${to.html()}</b><br></p>\
        <hr></hr>` +
              message.val() +
              `<p style="text-align: right; font-size: 12px">
                <span class="msg-timestamp">
                  ${new Date().getHours()}:${new Date().getMinutes()}
                </span><i class="fa fa-check" aria-hidden="true"></i>      
                </p>` +
              chat_bubble_part_2
          );
        $("#via-eb-input").prop("checked", false);
        $("#send-message-button").html("REPLY");
      }

      // reset the box value
      message.val("");
      // scroll down
      animateIFrame();
      // refresh threads window
      threads_window.contentDocument.location.reload(true);
    }
  });

  msg.on("viaeb", data => {
    list_item = $(`#${space_to_underscore(data.from)}_list_item`).get(0).outerHTML;
    $(`#${space_to_underscore(data.from)}_list_item`).remove();
    $(`#user-list`).prepend(list_item);
    $(`#${space_to_underscore(data.from)}_notification`).removeClass("read");
  })

  msg.on("newmessage", data => {
    list_item = $(`#${space_to_underscore(data.name)}_list_item`).get(0).outerHTML;
    $(`#${space_to_underscore(data.name)}_list_item`).remove();
    $(`#user-list`).prepend(list_item);
    hours = new Date().getHours();
    minutes = new Date().getMinutes();
    if(minutes<10) { 
      minutes = "0"+minutes
    }
    if (data.name == $("#from_user").html()) {
      if (
        !data.viaeb ||
        to_user_type.html() == "1" ||
        from_user_type.html() == "1"
      ) {
        $("#message-window")
          .contents()
          .find("body")
          .append(chat_bubble_part_r_1 + data.message +
            `<p style="text-align: right; font-size: 12px">
            <span class="msg-timestamp"><i class="fa fa-check" aria-hidden="true"></i>
            ${hours}:${minutes}
            </span>      
            </p>` + chat_bubble_part_r_2);
      } else {
        $("#message-window")
          .contents()
          .find("body")
          .append(
            chat_bubble_part_r_1 +
              `<i>via eb</i>\
              <p>From: <b>${from.html()}</b><br></p>\
              <p>To: <b>${to.html()}</b><br></p>\
              <hr></hr>` +
              data.message +
              `<p style="text-align: right; font-size: 12px">
              <span class="msg-timestamp"><i class="fa fa-check" aria-hidden="true"></i>
              ${hours}:${minutes}
              </span>      
              </p>` +
              chat_bubble_part_r_2
          );
        $("#via-eb-input").prop("checked", false);
        $("#send-message-button").html("REPLY");
      }
      animateIFrame();
      threads_window.contentDocument.location.reload(true);
      msg.emit("acknowledge", {
        ack: "ack",
        name: data.name
      });
    } else {
      $(`#${space_to_underscore(data.name)}_notification`).removeClass("read");
    }
  });
});
