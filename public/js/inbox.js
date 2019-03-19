$(document).ready(() => {
  $("#message_box").hide()
  $("#send_message").hide()
  $("#via-eb-col").hide()
  $("#message_box").keyup(function(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
        $("#send_message").click();
    }
  })

  $('#via-eb-input').change(function() {
    console.log("Pressed")
      if(this.checked) {
        $("#send-message-button").html("REPLY VIA EB");
      }else{
        $("#send-message-button").html("REPLY");
      }
  });

});
