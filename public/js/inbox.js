$(document).ready(() => {
  $("#message_box").hide()
  $("#send_message").hide()
  $("#message_box").keyup(function(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
        $("#send_message").click();
    }
  })
});
